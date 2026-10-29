import { createHmac, timingSafeEqual } from 'node:crypto'

/** Signed-cookie helpers shared by the server code and proxy.ts. No framework imports, so it is safe anywhere on the server. */
export const SESSION_COOKIE = 'admin_session'
export const SESSION_SECONDS = 60 * 60 * 8

const secret = () => {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set (32+ chars)')
  return s
}

export const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export const safeEqual = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b)

export function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

/** True only for an untampered, unexpired token we issued. Never throws. */
export function verifySessionToken(value: string | undefined | null): boolean {
  try {
    if (!value) return false
    const [payload, sig] = value.split('.')
    if (!payload || !sig || !safeEqual(Buffer.from(sig), Buffer.from(sign(payload)))) return false
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && exp > Date.now() / 1000
  } catch {
    return false
  }
}
