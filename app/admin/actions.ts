'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSession, destroySession, isAuthenticated, verifyCredentials } from '@/lib/auth'
import { db } from '@/lib/db'
import { clientIp, hashIp } from '@/lib/server-utils'

export type LoginState = {
  error?: string
  /** ISO time until which this IP is blocked */
  blockedUntil?: string
  attemptsLeft?: number
}

const MAX_ATTEMPTS = 5
const BLOCK_MS = 15 * 60_000

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const ipHash = hashIp(await clientIp())
  const since = new Date(Date.now() - BLOCK_MS)

  // Failed attempts are stored in the database so the block survives restarts and multiple instances.
  const recent = await db.loginAttempt.findMany({
    where: { ipHash, createdAt: { gt: since } },
    orderBy: { createdAt: 'desc' },
    take: MAX_ATTEMPTS,
  })
  if (recent.length >= MAX_ATTEMPTS) {
    const blockedUntil = new Date(recent[0].createdAt.getTime() + BLOCK_MS).toISOString()
    return { error: 'Too many failed attempts. This device is blocked for 15 minutes.', blockedUntil }
  }

  const username = String(formData.get('username') ?? '').slice(0, 100)
  const password = String(formData.get('password') ?? '').slice(0, 200)
  await new Promise((r) => setTimeout(r, 400)) // slow down guessing

  if (!verifyCredentials(username, password)) {
    await db.loginAttempt.create({ data: { ipHash } })
    const used = recent.length + 1
    if (used >= MAX_ATTEMPTS) {
      return {
        error: 'Too many failed attempts. This device is blocked for 15 minutes.',
        blockedUntil: new Date(Date.now() + BLOCK_MS).toISOString(),
      }
    }
    return { error: 'Incorrect username or password.', attemptsLeft: MAX_ATTEMPTS - used }
  }

  await db.loginAttempt.deleteMany({ where: { ipHash } })
  db.loginAttempt
    .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 3600_000) } } })
    .catch(() => {})
  await createSession()
  redirect('/admin')
}

export async function logout() {
  await destroySession()
  redirect('/admin/login')
}

const STATUSES = ['NEW', 'CONTACTED', 'CLOSED'] as const

export async function setStatus(id: string, status: string) {
  if (!(await isAuthenticated())) redirect('/admin/login')
  if (!(STATUSES as readonly string[]).includes(status)) return
  await db.enquiry.update({ where: { id }, data: { status: status as (typeof STATUSES)[number] } })
  revalidatePath('/admin', 'layout')
}

export async function deleteEnquiry(id: string) {
  if (!(await isAuthenticated())) redirect('/admin/login')
  await db.enquiry.delete({ where: { id } })
  revalidatePath('/admin', 'layout')
  redirect('/admin/enquiries')
}
