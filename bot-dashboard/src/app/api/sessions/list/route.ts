/* /api/sessions/list */
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { kSess, kMatches, kStatus, kLogs } from '@/lib/keys'

export async function GET(req: NextRequest) {
  const r = await getRedis()
  // WARNING: KEYS can be heavy with many sessions — for small debug use it's fine
  const keys = await r.keys('sess:*')
  const sessionIds = [...new Set(keys.map((k) => k.split(':')[1]))] // remove subkeys like matches/logs

  const rows = await Promise.all(
    sessionIds.map(async (id) => {
      const [sess, matchesStr, status, logLen] = await Promise.all([
        r.hGetAll(kSess(id)),
        r.get(kMatches(id)),
        r.get(kStatus(id)),
        r.lLen(kLogs(id))
      ])
      if (!sess || Object.keys(sess).length === 0) return null
      return {
        session: id,
        startAt: Number(sess.startAt),
        updatedAt: Number(sess.updatedAt),
        totalMatches: Number(matchesStr || 0),
        status: status || (sess.status ?? 'normal'),
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
