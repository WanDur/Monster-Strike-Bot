import type { LogLine, StatusKind } from './types'

export function deriveStatus(recent: LogLine[], windowMs = 5 * 60_000): StatusKind {
  const now = Date.now()
  const w = recent.filter((x) => now - x.ts <= windowMs)
  if (w.some((x) => x.level === 'error')) return 'stopped'
  if (w.some((x) => x.level === 'warning')) return 'alert'
  return 'normal'
}
