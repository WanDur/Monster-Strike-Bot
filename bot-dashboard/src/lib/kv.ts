import { kv } from '@vercel/kv'
import type { LogLine, SessionRecord } from './types'

export const SESSION_TTL = 60 * 60 * 48 // 48h
const LOG_LIMIT = 500

export function kSess(id: string) {
  return `sess:${id}`
}
export function kMatches(id: string) {
  return `sess:${id}:matches`
}
export function kStatus(id: string) {
  return `sess:${id}:status`
}
export function kLogs(id: string) {
  return `sess:${id}:logs`
}
export function kIdem(id: string, key: string) {
  return `sess:${id}:idem:${key}`
}

export async function createSession(id: string, now = Date.now()) {
  const rec: SessionRecord = {
    startAt: now,
    updatedAt: now,
    totalMatches: 0,
    status: 'normal'
  }
  await kv.hset(kSess(id), rec)
  await kv.expire(kSess(id), SESSION_TTL)
  await kv.set(kMatches(id), 0, { ex: SESSION_TTL })
  await kv.set(kStatus(id), 'normal', { ex: SESSION_TTL })
}

export async function readSession(id: string): Promise<SessionRecord | null> {
  const h = await kv.hgetall<SessionRecord>(kSess(id))
  if (!h) return null
  const totalMatches = Number(await kv.get(kMatches(id))) || 0
  const status = ((await kv.get<string>(kStatus(id))) as any) || 'normal'
  return { ...h, totalMatches, status }
}

export async function pushLog(id: string, line: LogLine) {
  await kv.lpush(kLogs(id), JSON.stringify(line))
  await kv.ltrim(kLogs(id), 0, LOG_LIMIT - 1)
  await kv.expire(kLogs(id), SESSION_TTL)
}

export async function readLogs(id: string, count = 100): Promise<LogLine[]> {
  const arr = await kv.lrange<string>(kLogs(id), 0, count - 1)
  const parsed = arr.map((s) => JSON.parse(s) as LogLine)
  // lrange returns newest-first; reverse to newest-last for UI convenience
  return parsed.reverse()
}
