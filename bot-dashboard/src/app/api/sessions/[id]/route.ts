import { NextRequest, NextResponse } from 'next/server'
import { readSession, readLogs } from '@/lib/kv'

export const runtime = 'edge'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id.trim()
  const rec = await readSession(id)
  if (!rec) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const logs = await readLogs(id, 100)
  return NextResponse.json(
    {
      session: id,
      startAt: rec.startAt,
      updatedAt: rec.updatedAt,
      totalMatches: rec.totalMatches,
      status: rec.status,
      logs
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
