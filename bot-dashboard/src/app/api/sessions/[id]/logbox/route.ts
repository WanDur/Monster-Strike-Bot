/* /api/sessions/:id/logbox */
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { kSess, kIdem, kLogs, kStatus } from '@/lib/keys'
import { deriveStatus } from '@/lib/status'
import type { LogLine } from '@/lib/types'
import { timingSafeEq } from '@/lib/auth'

export const runtime = 'nodejs'

const ALLOWED_KEYS = new Set(['message', 'level'])
const ALLOWED_LEVELS = new Set<LogLine['level']>(['log', 'info', 'warning', 'error'])

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sid = id.trim()
  const r = await getRedis()

  const sess = await r.hGetAll(kSess(sid))
  if (!sess || Object.keys(sess).length === 0) {
    return NextResponse.json(
      { error: 'unknown session', message: 'No session found for the provided id.' },
      { status: 404 }
    )
  }

  // Auth
  const tokenHdr = req.headers.get('x-write-token')
  if (!timingSafeEq(tokenHdr, (sess as any).writeToken)) {
    return NextResponse.json({ error: 'unauthorized', message: 'Invalid x-write-token.' }, { status: 401 })
  }

  // Validate request body
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'Request body must be valid JSON.' }, { status: 400 })
  }

  // Reject unknown keys
  const receivedKeys = Object.keys(body ?? {})
  const unknownKeys = receivedKeys.filter((k) => !ALLOWED_KEYS.has(k))
  if (unknownKeys.length > 0) {
    return NextResponse.json(
      {
        error: 'unexpected_parameters',
        message: 'Only "message" (required) and "level" (optional) are allowed.',
        allowedKeys: Array.from(ALLOWED_KEYS),
        unknownKeys,
        received: body
      },
      { status: 400 }
    )
  }

  // Require message
  if (typeof body?.message !== 'string' || body.message.trim() === '') {
    return NextResponse.json(
      {
        error: 'missing_or_invalid_message',
        message: '"message" is required and must be a non-empty string.'
      },
      { status: 400 }
    )
  }

  let level: LogLine['level'] = 'log'
  if (body.level !== undefined) {
    if (typeof body.level !== 'string' || !ALLOWED_LEVELS.has(body.level as LogLine['level'])) {
      return NextResponse.json(
        {
          error: 'invalid_level',
          message: `"level" must be one of: ${Array.from(ALLOWED_LEVELS).join(', ')}.`,
          received: body.level
        },
        { status: 400 }
      )
    }
    level = body.level as LogLine['level']
  }

  // Idempotency
  const idem = req.headers.get('x-idempotency-key') || ''
  if (idem) {
    const ok = await r.set(kIdem(sid, idem), '1', { NX: true, EX: 30 * 60 })
    if (ok === null) {
      return NextResponse.json({ ok: true, reused: true })
    }
  }

  const ts = Date.now()

  // Push log & trim
  const line: LogLine = { level, message: String(body.message), ts }
  await r.lPush(kLogs(sid), JSON.stringify(line))
  await r.lTrim(kLogs(sid), 0, 499)

  await r.hSet(kSess(sid), { updatedAt: String(Date.now()) })

  const recent = (await r.lRange(kLogs(sid), 0, 49)).map((s) => JSON.parse(s) as LogLine)
  const status = deriveStatus(recent)
  await r.set(kStatus(sid), status)

  return NextResponse.json({ ok: true, status })
}
