'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyAdminTheme, currentAdminTheme, type AdminTheme } from '@/lib/admin-theme'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  /** "row": full-width sidebar row with a label. "icon": compact square button. */
  variant?: 'row' | 'icon'
  className?: string
}

/** Switches the admin between light and dark mode and remembers the choice. */
export function ThemeToggle({ variant = 'row', className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<AdminTheme>('dark')

  useEffect(() => setTheme(currentAdminTheme()), [])

  const toggle = () => {
    const next: AdminTheme = theme === 'dark' ? 'light' : 'dark'
    applyAdminTheme(next)
    setTheme(next)
  }

  const Icon = theme === 'dark' ? Sun : Moon
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className={cn(
          'grid size-11 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground',
          className,
        )}
      >
        <Icon aria-hidden className="size-5" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground',
        className,
      )}
    >
      <Icon aria-hidden className="size-[18px]" />
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
