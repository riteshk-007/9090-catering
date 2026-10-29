'use client'

import { useActionState, useEffect, useState } from 'react'
import { Eye, EyeOff, Loader2, LockKeyhole, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '../actions'

function useCountdown(until?: string) {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    if (!until) return setLeft(0)
    const tick = () => setLeft(Math.max(0, Math.ceil((new Date(until).getTime() - Date.now()) / 1000)))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [until])
  return left
}

export function LoginForm({ initialBlockedUntil }: { initialBlockedUntil?: string }) {
  const [state, action, pending] = useActionState(login, {})
  const [show, setShow] = useState(false)
  const left = useCountdown(state.blockedUntil ?? initialBlockedUntil)
  const blocked = left > 0
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <form action={action} className="grid gap-5" aria-busy={pending}>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          required
          autoFocus
          disabled={blocked}
          className="h-10"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={blocked}
            className="h-10 pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {blocked ? (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <div>
            <p>Too many failed attempts. Sign-in is disabled for this device.</p>
            <p className="mt-1 font-medium tabular-nums">
              Try again in {mm}:{ss}
            </p>
          </div>
        </div>
      ) : (
        state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
            {state.attemptsLeft !== undefined && (
              <span className="text-muted-foreground">
                {' '}
                {state.attemptsLeft} attempt{state.attemptsLeft === 1 ? '' : 's'} left before a 15-minute
                block.
              </span>
            )}
          </p>
        )
      )}

      <Button type="submit" disabled={pending || blocked} className="h-10 w-full text-sm">
        {pending ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
