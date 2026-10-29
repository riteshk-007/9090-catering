'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Expand } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { GALLERY_CATEGORIES, type GalleryItem } from '@/lib/gallery'
import { Lightbox } from '@/components/common/lightbox'

export function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState<number | null>(null)

  const filters = useMemo(
    () => ['All', ...GALLERY_CATEGORIES.filter((c) => items.some((i) => i.category === c))],
    [items],
  )
  const shown = filter === 'All' ? items : items.filter((i) => i.category === filter)

  if (items.length === 0) {
    return (
      <section className="bg-ivory text-charcoal">
        <p className="mx-auto max-w-[1440px] px-5 py-14 text-center text-charcoal/60 sm:px-8 lg:px-12">
          Our gallery is being prepared. Please check back soon.
        </p>
      </section>
    )
  }

  return (
    <section className="bg-ivory text-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 md:py-16 lg:px-12">
        <Eyebrow tone="deep">Browse</Eyebrow>
        <div
          role="group"
          aria-label="Gallery categories"
          className="mt-6 flex flex-wrap gap-x-1 border-b border-charcoal/15"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'relative min-h-11 py-3 pr-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors',
                filter === f ? 'text-gold-deep' : 'text-charcoal/55 hover:text-charcoal',
              )}
            >
              {f}
              {filter === f && (
                <motion.span
                  layoutId="gallery-tab"
                  className="absolute inset-x-0 -bottom-px h-px bg-gold-deep"
                />
              )}
            </button>
          ))}
        </div>

        <ul className="mt-10 columns-2 gap-3 sm:gap-5 lg:columns-3">
          <>
            {shown.map((it, idx) => (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mb-3 break-inside-avoid sm:mb-5"
              >
                <button
                  type="button"
                  onClick={() => setOpen(idx)}
                  aria-label={`Enlarge photo: ${it.alt}`}
                  style={{ aspectRatio: `${it.width} / ${it.height}` }}
                  className="group relative block w-full cursor-zoom-in overflow-hidden bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                >
                  <Photo
                    src={it.url}
                    alt={it.alt}
                    sizes="(min-width:1024px) 33vw, (min-width:480px) 50vw, 100vw"
                    className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-obsidian/75 via-obsidian/0 to-obsidian/0 p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:hidden sm:p-4"
                  >
                    <span className="line-clamp-2 text-left text-xs text-ivory">{it.category}</span>
                    <Expand className="size-4 shrink-0 text-champagne" />
                  </span>
                </button>
              </motion.li>
            ))}
          </>
        </ul>
        <p className="mt-8 text-[11px] text-charcoal/50">
          Photographs are illustrative and do not represent specific client events.
        </p>
      </div>
      <Lightbox items={shown.map((i) => ({ src: i.url, alt: i.alt }))} index={open} onChange={setOpen} />
    </section>
  )
}
