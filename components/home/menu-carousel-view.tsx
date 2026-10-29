'use client'

import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { LabelPills, money } from '@/components/menu/dish-parts'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel'
import type { HomeMenuItem, MenuSettingsView } from '@/lib/menu'
import { DishDialog } from './dish-dialog'

function PlayPause() {
  const { playing, togglePlay, hasAutoplay } = useCarousel()
  if (!hasAutoplay) return null
  return (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={playing ? 'Pause automatic sliding' : 'Start automatic sliding'}
      className="grid size-11 place-items-center border border-gold/50 text-ivory transition-colors hover:bg-gold hover:text-obsidian"
    >
      {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
    </button>
  )
}

type MenuCarouselViewProps = {
  items: HomeMenuItem[]
  settings: MenuSettingsView
}

/** Auto-scrolling carousel of dishes. Each slide opens a dialog with the full details. */
export function MenuCarouselView({ items, settings }: MenuCarouselViewProps) {
  const [selected, setSelected] = useState<HomeMenuItem | null>(null)

  return (
    <section
      id="menu-highlights"
      className="border-t border-gold/20 bg-charcoal"
      aria-label="Menu highlights"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Carousel
          autoplayMs={settings.carouselSeconds * 1000}
          opts={{ align: 'start', loop: items.length > 1 }}
        >
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>From the menu</Eyebrow>
              <h2 className="mt-6 font-serif text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                Dishes we <em className="font-normal text-champagne">love.</em>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <PlayPause />
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Reveal>

          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={item.id} className="basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  aria-haspopup="dialog"
                  aria-label={`View details: ${item.name}`}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-obsidian">
                    {item.imageUrl ? (
                      <Photo
                        src={item.imageUrl}
                        alt={item.imageAlt || item.name}
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 82vw"
                        className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center border border-gold/30 bg-gradient-to-br from-[#26241f] to-obsidian p-6 text-center transition-colors duration-500 group-hover:border-gold/70">
                        <span className="flex flex-col items-center gap-4">
                          <span aria-hidden className="h-px w-10 bg-gold" />
                          <span className="font-serif text-3xl leading-tight text-champagne">
                            {item.name}
                          </span>
                          <span aria-hidden className="h-px w-10 bg-gold" />
                        </span>
                      </div>
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent"
                    />
                    <span className="absolute right-3 bottom-3 border border-gold/60 bg-obsidian/70 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-champagne uppercase opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100">
                      View
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                      {item.categoryName}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-3">
                      <h3 className="min-w-0 font-serif text-2xl leading-tight text-ivory">{item.name}</h3>
                      {settings.showPrices && item.price && (
                        <span className="shrink-0 text-sm text-champagne">{money(settings, item.price)}</span>
                      )}
                    </div>
                    {item.labels.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <LabelPills labels={item.labels} />
                      </div>
                    )}
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8">
          <TextLink href="/menu" tone="light">
            View the full menu
          </TextLink>
        </div>
      </div>

      <DishDialog item={selected} settings={settings} onClose={() => setSelected(null)} />
    </section>
  )
}
