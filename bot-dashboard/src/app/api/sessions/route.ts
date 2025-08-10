import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { randomId, randomToken } from '@/lib/auth'
import { SESSION_TTL_SEC, kSess, kMatches, kStatus } from '@/lib/keys'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const r = await getRedis()
  let body: any = {}
  try {
    body = await req.json()
  } catch {}
  const session = String(body?.session ?? randomId()).trim()
  const now = Date.now()
  const writeToken = randomToken()

  // Create hash + aux keys
  await r.hSet(kSess(session), {
    startAt: String(now),
    updatedAt: String(now),
    status: 'normal',
    writeToken // stays server-side for auth
  })
  await r.expire(kSess(session), SESSION_TTL_SEC)

  await r.set(kMatches(session), '0', { EX: SESSION_TTL_SEC })
  await r.set(kStatus(session), 'normal', { EX: SESSION_TTL_SEC })

  return NextResponse.json({ session, startAt: now, writeToken }, { status: 201 })
}
