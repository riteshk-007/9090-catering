'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChefHat,
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  ListTree,
  LogOut,
  Menu as MenuIcon,
  Settings2,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from 'lucide-react'
import { logout } from '@/app/admin/actions'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
  exact?: boolean
  hint?: string
}
type NavGroup = { title: string; items: NavItem[] }

/** Left navigation. On phones it becomes a slide-in drawer opened from the top bar. */
export function AdminShell({ newEnquiries, children }: { newEnquiries: number; children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const groups: NavGroup[] = [
    {
      title: 'Dashboard',
      items: [
        {
          label: 'Overview',
          href: '/admin',
          icon: LayoutDashboard,
          exact: true,
          hint: 'Summary and quick links',
        },
        {
          label: 'Enquiries',
          href: '/admin/enquiries',
          icon: Inbox,
          badge: newEnquiries,
          hint: 'Messages from the contact form',
        },
      ],
    },
    {
      title: 'Menu',
      items: [
        {
          label: 'Categories & dishes',
          href: '/admin/menu',
          icon: ListTree,
          exact: true,
          hint: 'Add, edit and reorder dishes',
        },
        {
          label: 'Menu page settings',
          href: '/admin/menu/settings',
          icon: Settings2,
          hint: 'Prices, texts and home carousel',
        },
      ],
    },
    {
      title: 'Photos',
      items: [{ label: 'Gallery', href: '/admin/gallery', icon: Images, hint: 'Upload and arrange photos' }],
    },
  ]

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href))

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-5">
        <ChefHat className="size-5 text-primary" aria-hidden />
        <span className="text-lg font-semibold tracking-tight">
          9090 <span className="text-primary">Admin</span>
        </span>
      </div>

      <nav aria-label="Admin sections" className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {group.title}
            </p>
            <ul className="grid gap-1">
              {group.items.map((item) => {
                const active = isActive(item)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-primary/12 text-primary'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-primary"
                        />
                      )}
                      <item.icon aria-hidden className="size-[18px] shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{item.label}</span>
                        {item.hint && (
                          <span className="block truncate text-xs font-normal text-muted-foreground">
                            {item.hint}
                          </span>
                        )}
                      </span>
                      {item.badge ? (
                        <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <ThemeToggle />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink aria-hidden className="size-[18px]" />
          View website
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-foreground/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut aria-hidden className="size-[18px]" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card lg:block">{nav}</aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
        <span className="text-base font-semibold tracking-tight">
          9090 <span className="text-primary">Admin</span>
        </span>
        <div className="flex items-center">
          <ThemeToggle variant="icon" />
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="relative grid size-11 place-items-center rounded-lg hover:bg-muted"
          >
            <MenuIcon aria-hidden />
            {newEnquiries > 0 && (
              <span aria-hidden className="absolute top-2 right-2 size-2.5 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 w-[min(20rem,88vw)] border-r border-border bg-card shadow-2xl">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-lg hover:bg-muted"
            >
              <X aria-hidden className="size-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
