import Link from 'next/link'
import { Logo } from '@/components/layout/logo'

const quick = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Menu', href: '/menu' },
]
const services = [
  { label: 'Catering Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title} className="min-w-0">
      <p className="mb-4 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">{title}</p>
      <ul className="flex flex-col">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-11 items-center text-sm text-ivory/65 transition-colors hover:text-champagne"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Contact details and social links are intentionally omitted until verified details are supplied. */
export function Footer() {
  return (
    <footer className="border-t border-gold/50 bg-obsidian">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 sm:grid-cols-2 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="min-w-0 sm:col-span-2 lg:col-span-4">
          <Link href="/" aria-label="9090 Catering — home" className="inline-block">
            <Logo className="sm:h-14" />
          </Link>
          <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ivory/80">
            Thoughtful food, beautifully presented, for the moments that matter.
          </p>
        </div>
        <div className="lg:col-span-2 lg:col-start-6">
          <Column title="Quick links" links={quick} />
        </div>
        <div className="lg:col-span-2">
          <Column title="Services" links={services} />
        </div>
        <div className="min-w-0 sm:col-span-2 lg:col-span-3 lg:col-start-10">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">Enquiries</p>
          <Link
            href="/contact"
            className="inline-block font-serif text-2xl text-ivory transition-colors hover:text-champagne"
          >
            Plan your occasion →
          </Link>
          <p className="mt-3 text-sm text-ivory/50">Share your event details and we will get back to you.</p>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-5 py-6 text-[11px] tracking-[0.16em] text-ivory/40 uppercase sm:px-8 md:flex-row md:justify-between lg:px-12">
          <span>© {new Date().getFullYear()} 9090 Catering</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}
