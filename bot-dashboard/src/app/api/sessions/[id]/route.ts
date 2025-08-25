/* /api/sessions/:id */
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { kSess, kMatches, kStatus, kLogs } from '@/lib/keys'
import type { LogLine } from '@/lib/types'

export const runtime = 'nodejs'

const STALE_MS = 15 * 60 * 1000 // set stopped after 15 minutes

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = id.trim()
  const r = await getRedis()

  const sess = await r.hGetAll(kSess(sid))
  if (!sess || Object.keys(sess).length === 0) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const startAt = Number(sess.startAt) || 0
  const updatedAt = Number(sess.updatedAt) || 0

  const totalMatches = Number(await r.get(kMatches(sid))) || 0
  const statusFromStore = (await r.get(kStatus(sid))) || (sess.status ?? 'normal')

  const isStale = updatedAt > 0 && Date.now() - updatedAt > STALE_MS
  const status = isStale ? 'stopped' : statusFromStore

  if (isStale && statusFromStore !== 'stopped') {
    await r.set(kStatus(sid), 'stopped')
  }

  const raw = await r.lRange(kLogs(sid), 0, 99)
  const logs = raw.map((s) => JSON.parse(s) as LogLine).reverse()

  return NextResponse.json(
    {
      session: sid,
      startAt,
      updatedAt,
      totalMatches,
      status,
      logs
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
