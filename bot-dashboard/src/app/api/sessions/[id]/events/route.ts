import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { kIdem, kMatches, kSess, kLogs, readLogs } from '@/lib/kv'
import { checkWriteToken } from '@/lib/auth'
import { deriveStatus, setStatus } from '@/lib/status'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id.trim()
  const idem = req.headers.get('x-idempotency-key') || ''
  const token = req.headers.get('x-write-token')

  // auth
  const sess = await kv.hgetall<Record<string, any>>(kSess(id))
  if (!sess) return NextResponse.json({ error: 'unknown session' }, { status: 404 })
  if (!checkWriteToken(token, sess.writeToken)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // idempotency
  if (idem) {
    const seen = await kv.get(kIdem(id, idem))
    if (seen) {
      const totalMatches = Number(await kv.get(kMatches(id))) || 0
      return NextResponse.json({ ok: true, totalMatches, reused: true })
    }
  }

  // accept only match_completed for now
  let type = 'match_completed'
  try {
    const body = await req.json()
    type = body?.type || 'match_completed'
  } catch {}

  if (type !== 'match_completed') {
    return NextResponse.json({ error: 'unsupported event' }, { status: 400 })
  }

  // INCR and update times
  const totalMatches = await kv.incr(kMatches(id))
  await kv.hset(kSess(id), { updatedAt: Date.now() })
  // push a lightweight log
  await kv.lpush(kLogs(id), JSON.stringify({ level: 'log', message: 'match_completed', ts: Date.now() }))
  await kv.ltrim(kLogs(id), 0, 499)

  // recompute status from recent logs
  const recent = await readLogs(id, 50)
  await setStatus(id, deriveStatus(recent))

  if (idem) await kv.set(kIdem(id, idem), 1, { ex: 30 * 60 }) // 30 min

  return NextResponse.json({ ok: true, totalMatches })
}
