'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CarouselApi = UseEmblaCarouselType[1]

type CarouselProps = {
  opts?: Parameters<typeof useEmblaCarousel>[0]
  /** Auto-advance delay in ms. Omit (or respect reduced motion) to disable autoplay. */
  autoplayMs?: number
}

type CarouselContextProps = {
  carouselRef: UseEmblaCarouselType[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  playing: boolean
  togglePlay: () => void
  hasAutoplay: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error('useCarousel must be used within a <Carousel />')
  return context
}

/** shadcn-style carousel built on Embla, with optional autoplay that pauses on hover/focus and can be toggled. */
function Carousel({
  opts,
  autoplayMs,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [plugins] = React.useState(() =>
    autoplayMs
      ? [Autoplay({ delay: autoplayMs, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })]
      : [],
  )
  const [carouselRef, api] = useEmblaCarousel({ align: 'start', loop: true, ...opts }, plugins)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [playing, setPlaying] = React.useState(plugins.length > 0)

  const onSelect = React.useCallback((a: CarouselApi) => {
    if (!a) return
    setCanScrollPrev(a.canScrollPrev())
    setCanScrollNext(a.canScrollNext())
  }, [])

  // Respect the visitor's reduced-motion setting: start paused (they can still press play).
  React.useEffect(() => {
    if (!api || plugins.length === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      api.plugins().autoplay?.stop()
      setPlaying(false)
    }
  }, [api, plugins.length])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect).on('select', onSelect)
    return () => {
      api.off('reInit', onSelect).off('select', onSelect)
    }
  }, [api, onSelect])

  const togglePlay = React.useCallback(() => {
    const autoplay = api?.plugins().autoplay
    if (!autoplay) return
    if (autoplay.isPlaying()) {
      autoplay.stop()
      setPlaying(false)
    } else {
      autoplay.play()
      setPlaying(true)
    }
  }, [api])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        scrollPrev: () => api?.scrollPrev(),
        scrollNext: () => api?.scrollNext(),
        canScrollPrev,
        canScrollNext,
        playing,
        togglePlay,
        hasAutoplay: plugins.length > 0,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        onKeyDownCapture={(e) => {
          if (e.key === 'ArrowLeft') api?.scrollPrev()
          if (e.key === 'ArrowRight') api?.scrollNext()
        }}
        className={cn('relative', className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef } = useCarousel()
  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div className={cn('-ml-4 flex', className)} {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn('min-w-0 shrink-0 grow-0 basis-full pl-4', className)}
      {...props}
    />
  )
}

const navButton =
  'grid size-11 place-items-center border border-gold/50 text-ivory transition-colors hover:bg-gold hover:text-obsidian disabled:opacity-40'

function CarouselPrevious({ className, ...props }: React.ComponentProps<'button'>) {
  const { scrollPrev, canScrollPrev } = useCarousel()
  return (
    <button type="button" aria-label="Previous slide" disabled={!canScrollPrev} onClick={scrollPrev} className={cn(navButton, className)} {...props}>
      <ArrowLeft className="size-5" aria-hidden />
    </button>
  )
}

function CarouselNext({ className, ...props }: React.ComponentProps<'button'>) {
  const { scrollNext, canScrollNext } = useCarousel()
  return (
    <button type="button" aria-label="Next slide" disabled={!canScrollNext} onClick={scrollNext} className={cn(navButton, className)} {...props}>
      <ArrowRight className="size-5" aria-hidden />
    </button>
  )
}

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel, type CarouselApi }
