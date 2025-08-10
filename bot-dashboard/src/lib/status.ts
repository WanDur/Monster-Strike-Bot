import { kv } from '@vercel/kv'
import type { LogLine, StatusKind } from './types'
import { kStatus } from './kv'

export function deriveStatus(recent: LogLine[], windowMs = 5 * 60_000): StatusKind {
  const now = Date.now()
  const w = recent.filter((x) => now - x.ts <= windowMs)
  if (w.some((x) => x.level === 'error')) return 'stopped'
  if (w.some((x) => x.level === 'warning')) return 'alert'
  return 'normal'
}

export async function setStatus(id: string, s: StatusKind) {
  await kv.set(kStatus(id), s)
}
