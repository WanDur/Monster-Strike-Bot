import { NextRequest, NextResponse } from 'next/server'
import { createSession, readSession } from '@/lib/kv'
import { randomId, randomToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  // optional body: { session?: string }
  let session = ''
  try {
    const b = await req.json().catch(() => ({} as any))
    session = (b.session || randomId()).trim()
  } catch {
    session = randomId()
  }

  // write token per session (return to bot; keep in memory/file on bot side)
  const writeToken = randomToken()
  await createSession(session)
  // store the token alongside the session
  // simplest: keep it in the hash
  await fetch(new URL(`/api/sessions/${session}`, req.url).toString()) // warm edge (optional)
  // attach token to session hash too:
  // (KV doesn't support nested hset easily with types, but you can store it separately)
  await import('@vercel/kv').then(({ kv }) => kv.hset(`sess:${session}`, { writeToken }))

  const rec = await readSession(session)
  return NextResponse.json({ session, writeToken, startAt: rec?.startAt }, { status: 201 })
}
