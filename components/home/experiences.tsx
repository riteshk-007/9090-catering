import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { photos } from '@/lib/photos'
import { cn } from '@/lib/utils'

const experiences = [
  {
    number: '01',
    title: 'Celebrations',
    image: photos.celebrations,
    alt: 'A long celebration table set with candles, flowers, and glassware',
    position: '50% 60%',
    layout: 'lg:col-span-7 aspect-[4/3] sm:aspect-[16/10]',
  },
  {
    number: '02',
    title: 'Corporate dining',
    image: photos.corporate,
    alt: 'A polished restaurant interior prepared for a business lunch',
    position: '50% 50%',
    layout: 'lg:col-span-5 aspect-[4/5] lg:row-span-2 lg:aspect-auto',
  },
  {
    number: '03',
    title: 'Private events',
    image: photos.private,
    alt: 'Friends gathered around a shared dinner table',
    position: '50% 45%',
    layout: 'lg:col-span-7 aspect-[4/3] sm:aspect-[16/9]',
  },
]

/** Three catering categories in an asymmetric photographic grid. */
export function Experiences() {
  return (
    <section id="services" className="bg-sand text-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 border-b border-charcoal/20 pb-8 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="deep">Made for the moment</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.92] font-medium tracking-[-0.03em]">
              Catering, <em className="font-normal text-gold-deep">considered.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-charcoal/60">
            A distinctive table for every kind of gathering.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {experiences.map((item, i) => (
            <Reveal
              key={item.number}
              delay={i * 0.08}
              className={cn('group relative overflow-hidden', item.layout)}
            >
              <Photo
                src={item.image}
                alt={item.alt}
                position={item.position}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/10 to-transparent"
              />
              <div className="absolute inset-x-5 bottom-5 flex flex-col items-start gap-3 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between sm:inset-x-8 sm:bottom-7">
                <div>
                  <span className="mb-2 block text-[11px] font-semibold tracking-[0.25em] text-champagne">
                    {item.number}
                  </span>
                  <h3 className="font-serif text-4xl leading-none text-ivory sm:text-5xl">{item.title}</h3>
                </div>
                <Link
                  href="/services"
                  aria-label={`Discover ${item.title}`}
                  className="inline-flex min-h-11 items-center gap-2 border-b border-gold/60 pb-1 text-[11px] font-semibold tracking-[0.22em] text-ivory uppercase after:absolute after:inset-0 after:content-['']"
                >
                  Discover <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
