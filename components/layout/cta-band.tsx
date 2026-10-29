import Link from 'next/link'
import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'

export function CtaBand({
  eyebrow = 'Catering enquiries',
  title,
  text,
  label,
  href = '/contact',
}: {
  eyebrow?: string
  title: React.ReactNode
  text: string
  label: string
  href?: string
}) {
  return (
    <section aria-label="Catering enquiry" className="border-t border-gold/20 bg-charcoal">
      <Reveal className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-8 max-w-4xl font-serif text-[clamp(2.6rem,7.5vw,6.5rem)] leading-[0.9] font-medium tracking-[-0.03em] text-balance uppercase">
          {title}
        </h2>
        <p className="mt-7 max-w-md text-sm leading-7 text-ivory/70 sm:text-[15px] sm:leading-8 lg:text-base">
          {text}
        </p>
        <Link
          href={href}
          className="mt-10 inline-block bg-gold px-8 py-5 text-[11px] font-bold tracking-[0.22em] text-obsidian uppercase transition-colors duration-300 hover:bg-champagne"
        >
          {label} ↗
        </Link>
      </Reveal>
    </section>
  )
}
