/* /api/sessions/:id */
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { kSess, kMatches, kStatus, kLogs } from '@/lib/keys'
import type { LogLine } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = id.trim()
  const r = await getRedis()

  const sess = await r.hGetAll(kSess(sid))
  if (!sess || Object.keys(sess).length === 0) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const totalMatches = Number(await r.get(kMatches(sid))) || 0
  const status = (await r.get(kStatus(sid))) || (sess.status ?? 'normal')

  const raw = await r.lRange(kLogs(sid), 0, 99) // newest-first
  const logs = raw.map((s) => JSON.parse(s) as LogLine).reverse() // newest-last for UI

  return NextResponse.json(
    {
      session: sid,
      startAt: Number(sess.startAt),
      updatedAt: Number(sess.updatedAt),
      totalMatches,
      status,
      logs
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
