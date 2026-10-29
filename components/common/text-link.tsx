import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type TextLinkProps = {
  href: string
  children: React.ReactNode
  /** "dark" for light backgrounds, "light" for dark backgrounds. */
  tone?: 'dark' | 'light'
}

/** Understated underlined call-to-action link with a sliding arrow. */
export function TextLink({ href, children, tone = 'dark' }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex min-h-11 items-center gap-3 border-b pb-1 text-[11px] font-semibold tracking-[0.24em] uppercase transition-colors',
        tone === 'dark'
          ? 'border-charcoal/30 text-charcoal hover:border-gold-deep hover:text-gold-deep'
          : 'border-ivory/30 text-ivory hover:border-gold hover:text-champagne',
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  )
}
