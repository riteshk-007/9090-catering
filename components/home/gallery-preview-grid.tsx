'use client'

import { useState } from 'react'
import { Eyebrow } from '@/components/common/eyebrow'
import { Lightbox } from '@/components/common/lightbox'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import type { GalleryItem } from '@/lib/gallery'
import { cn } from '@/lib/utils'

/** Editorial layout for exactly four photos; any other count falls back to an even grid. */
const BENTO = [
  'col-span-2 aspect-[4/5] lg:row-span-2 lg:aspect-auto',
  'aspect-[4/5] lg:col-span-2 lg:aspect-[4/3]',
  'aspect-[4/5]',
  'col-span-2 aspect-[16/9] lg:col-span-1 lg:aspect-[4/5]',
]

export function GalleryPreviewGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const bento = items.length === BENTO.length

  return (
    <section id="gallery" className="bg-ivory text-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tone="deep">The gallery</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(2.4rem,6.5vw,6rem)] leading-[0.92] font-medium tracking-[-0.03em]">
              From our <em className="font-normal text-gold-deep">table.</em>
            </h2>
          </div>
          <TextLink href="/gallery">View full gallery</TextLink>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Enlarge photo: ${item.alt}`}
              className={cn(
                'group relative cursor-zoom-in overflow-hidden bg-sand',
                bento ? BENTO[i] : 'aspect-[4/5]',
              )}
            >
              <Photo
                src={item.url}
                alt={item.alt}
                sizes={
                  i === 0 && bento ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'
                }
                className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
      <Lightbox items={items.map((i) => ({ src: i.url, alt: i.alt }))} index={open} onChange={setOpen} />
    </section>
  )
}
