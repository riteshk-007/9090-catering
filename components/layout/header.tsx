'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './language-switcher'
import { Logo } from './logo'
import { EASE } from '@/lib/motion'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500',
        scrolled || open
          ? 'border-gold/20 bg-obsidian'
          : 'border-ivory/10 bg-gradient-to-b from-obsidian/70 to-transparent',
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="9090 Catering — home" className="relative z-10 shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex xl:gap-9">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={cn(
                'group relative py-2 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors',
                isActive(l.href) ? 'text-champagne' : 'text-ivory/70 hover:text-ivory',
              )}
            >
              {l.label}
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500',
                  isActive(l.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <Link
            href="/contact"
            className="hidden border border-gold px-5 py-3 text-[11px] font-semibold tracking-[0.2em] text-champagne uppercase transition-colors duration-300 hover:bg-gold hover:text-obsidian md:block"
          >
            Book catering
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 -mr-2 grid size-11 place-items-center text-ivory lg:hidden"
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto overscroll-contain bg-obsidian lg:hidden"
          >
            <div className="flex min-h-full flex-col justify-between gap-8 px-5 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
              <ul>
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.045, duration: 0.55, ease: EASE }}
                    className="border-b border-ivory/10"
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(l.href) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-14 items-baseline gap-4 py-3 font-serif text-3xl sm:text-4xl',
                        isActive(l.href) ? 'text-champagne' : 'text-ivory',
                      )}
                    >
                      <span className="font-sans text-[10px] tracking-[0.2em] text-gold">0{i + 1}</span>
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <LanguageSwitcher variant="list" />
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="bg-gold px-6 py-4 text-center text-[11px] font-bold tracking-[0.22em] text-obsidian uppercase"
              >
                Book catering
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
