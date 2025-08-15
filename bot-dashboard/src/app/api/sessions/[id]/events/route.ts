/* /api/sessions/:id/events */
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { kSess, kIdem, kMatches, kLogs, kStatus } from '@/lib/keys'
import { deriveStatus } from '@/lib/status'
import type { LogLine } from '@/lib/types'
import { timingSafeEq } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = id.trim()
  const r = await getRedis()

  const sess = await r.hGetAll(kSess(sid))
  if (!sess || Object.keys(sess).length === 0) {
    return NextResponse.json({ error: 'unknown session' }, { status: 404 })
  }

  // Auth
  const tokenHdr = req.headers.get('x-write-token')
  if (!timingSafeEq(tokenHdr, (sess as any).writeToken)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Idempotency
  const idem = req.headers.get('x-idempotency-key') || ''
  if (idem) {
    const ok = await r.set(kIdem(sid, idem), '1', { NX: true, EX: 30 * 60 })
    if (ok === null) {
      const totalMatches = Number(await r.get(kMatches(sid))) || 0
      return NextResponse.json({ ok: true, totalMatches, reused: true })
    }
  }

  // Accept only match_completed
  let type = 'match_completed'
  try {
    const b = await req.json()
    type = b?.type || 'match_completed'
  } catch {}

  if (type !== 'match_completed') {
    return NextResponse.json({ error: 'unsupported event' }, { status: 400 })
  }

  const totalMatches = await r.incr(kMatches(sid))
  const now = Date.now()
  await r.hSet(kSess(sid), { updatedAt: String(now) })

  const log: LogLine = { level: 'log', message: 'match_completed', ts: now }
  await r.lPush(kLogs(sid), JSON.stringify(log))
  await r.lTrim(kLogs(sid), 0, 499)

  const recent = (await r.lRange(kLogs(sid), 0, 49)).map((s) => JSON.parse(s) as LogLine)
  const status = deriveStatus(recent)
  await r.set(kStatus(sid), status)

  return NextResponse.json({ ok: true, totalMatches })
}
