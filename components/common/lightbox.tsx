'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Photo } from '@/components/common/photo'

export type LightboxItem = { src: string; alt: string }

export function Lightbox({
  items,
  index,
  onChange,
}: {
  items: LightboxItem[]
  index: number | null
  onChange: (i: number | null) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange((index! + 1) % items.length)
      if (e.key === 'ArrowLeft') onChange((index! - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      trigger?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, items.length])

  const btn = 'absolute grid size-11 place-items-center text-ivory transition-colors hover:text-gold'

  return (
    <AnimatePresence>
      {open && items[index!] && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onChange(null)}
          className="fixed inset-0 z-[60] bg-obsidian/95"
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close viewer"
            onClick={() => onChange(null)}
            className={`${btn} top-3 right-3`}
          >
            <X aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              onChange((index! - 1 + items.length) % items.length)
            }}
            className={`${btn} bottom-3 left-3 sm:top-1/2 sm:bottom-auto sm:left-4 sm:-translate-y-1/2`}
          >
            <ChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              onChange((index! + 1) % items.length)
            }}
            className={`${btn} right-3 bottom-3 sm:top-1/2 sm:right-4 sm:bottom-auto sm:-translate-y-1/2`}
          >
            <ChevronRight aria-hidden />
          </button>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-3 top-14 bottom-20 sm:inset-x-20 sm:top-16 sm:bottom-16"
          >
            <Photo src={items[index!].src} alt={items[index!].alt} className="object-contain" sizes="100vw" />
          </motion.div>
          <p className="absolute inset-x-16 bottom-5 line-clamp-2 text-center text-xs tracking-wide text-ivory/60">
            {items[index!].alt} · {index! + 1}/{items.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
