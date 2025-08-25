/* /api/sessions/list */
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { kSess, kMatches, kStatus, kLogs } from '@/lib/keys'

const STALE_MS = 15 * 60 * 1000 // set stopped after 15 minutes

export async function GET(req: NextRequest) {
  const r = await getRedis()
  // WARNING: KEYS can be heavy with many sessions — for small debug use it's fine
  const keys = await r.keys('sess:*')
  const sessionIds = [...new Set(keys.map((k) => k.split(':')[1]))] // remove subkeys like matches/logs

  const rows = await Promise.all(
    sessionIds.map(async (id) => {
      const [sess, matchesStr, statusFromStore, logLen] = await Promise.all([
        r.hGetAll(kSess(id)),
        r.get(kMatches(id)),
        r.get(kStatus(id)),
        r.lLen(kLogs(id))
      ])

      if (!sess || Object.keys(sess).length === 0) return null

      const startAt = Number(sess.startAt) || 0
      const updatedAt = Number(sess.updatedAt) || 0

      const baseStatus = statusFromStore || (sess.status ?? 'normal')
      const isStale = updatedAt > 0 && Date.now() - updatedAt > STALE_MS
      const effectiveStatus = isStale ? 'stopped' : baseStatus

      if (isStale && baseStatus !== 'stopped') {
        await r.set(kStatus(id), 'stopped')
      }

      return {
        session: id,
        startAt,
        updatedAt,
        totalMatches: Number(matchesStr || 0),
        status: effectiveStatus,
        logCount: Number(logLen || 0)
      }
    })
  )

  const sorted = rows.filter(Boolean).sort((a, b) => b!.startAt - a!.startAt)

  return NextResponse.json(
    {
      total: sorted.length,
      items: sorted
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
