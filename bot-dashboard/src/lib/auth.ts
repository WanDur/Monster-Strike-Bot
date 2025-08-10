import crypto from 'crypto'

export function randomId(n = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < n; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

export function randomToken() {
  return crypto.randomBytes(24).toString('hex')
}

export function timingSafeEq(a?: string | null, b?: string) {
  if (!a || !b) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}
