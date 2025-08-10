import crypto from 'crypto'
export function checkWriteToken(provided: string | null, expected: string | undefined) {
  if (!provided || !expected) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  } catch {
    return false
  }
}
export function randomId(n = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < n; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}
export function randomToken() {
  return crypto.randomBytes(24).toString('hex')
}
