import { redirect } from 'next/navigation'
import { Logo } from '@/components/layout/logo'
import { isAuthenticated } from '@/lib/auth'
import { db } from '@/lib/db'
import { clientIp, hashIp } from '@/lib/server-utils'
import { ThemeToggle } from '@/components/admin/theme-toggle'
import { LoginForm } from './login-form'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin')

  // Show an existing block immediately on page load, not only after another attempt.
  const recent = await db.loginAttempt.findMany({
    where: { ipHash: hashIp(await clientIp()), createdAt: { gt: new Date(Date.now() - 15 * 60_000) } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  const blockedUntil =
    recent.length >= 5 ? new Date(recent[0].createdAt.getTime() + 15 * 60_000).toISOString() : undefined
  return (
    <main className="relative grid min-h-svh place-items-center px-4 py-12">
      <ThemeToggle variant="icon" className="absolute top-3 right-3" />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo className="sm:h-14" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">Authorised staff only.</p>
          </div>
        </div>
        <div className="rounded-xl border border-border border-t-primary bg-card p-6 shadow-xl shadow-black/30 sm:p-7">
          <LoginForm initialBlockedUntil={blockedUntil} />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Repeated failed sign-ins block this device for 15 minutes.
        </p>
      </div>
    </main>
  )
}
