import 'server-only'
import { scryptSync } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  SESSION_COOKIE,
  SESSION_SECONDS,
  createSessionToken,
  safeEqual,
  verifySessionToken,
} from '@/lib/session'

export { SESSION_COOKIE }

/**
 * Constant-time check of username + scrypt password hash.
 * The hash is stored as "scrypt:salt:hash". A colon is used because "$" gets expanded inside .env files,
 * which would silently corrupt the value. The old "scrypt$salt$hash" form is still accepted.
 */
export function verifyCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? ''
  const [scheme, salt, hash] = (process.env.ADMIN_PASSWORD_HASH ?? '').split(/[:$]/)
  if (scheme !== 'scrypt' || !salt || !hash) return false
  const given = scryptSync(password, salt, 64)
  const passOk = safeEqual(given, Buffer.from(hash, 'hex'))
  const userOk = safeEqual(Buffer.from(username), Buffer.from(expectedUser))
  return passOk && userOk
}

export async function createSession() {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_SECONDS,
  })
}

export async function destroySession() {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
}

export async function isAuthenticated() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value)
}

/**
 * Call at the top of every admin page and data-reading server code. Layouts are not re-run on client-side
 * navigation, so each page must check the session itself rather than relying on the layout alone.
 */
export async function requireAdmin() {
  if (!(await isAuthenticated())) redirect('/admin/login')
}
