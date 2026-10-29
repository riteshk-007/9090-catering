'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Photo } from '@/components/common/photo'
import { EASE } from '@/lib/motion'
import { photos } from '@/lib/photos'

/** Staggered fade-and-rise used by every hero element. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: EASE },
})

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-obsidian md:min-h-[90vh]"
    >
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
        className="absolute inset-0"
      >
        <Photo
          src={photos.hero}
          alt="An elegantly set restaurant table with plated gourmet dishes in warm light"
          position="60% 55%"
          priority
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/45 to-obsidian/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-obsidian/40"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 pt-32 pb-14 sm:px-8 md:pb-24 lg:px-12">
        <motion.p
          {...rise(0.4)}
          className="mb-6 flex items-start gap-4 text-[10px] leading-5 font-semibold tracking-[0.22em] text-champagne uppercase sm:items-center sm:text-[11px] sm:tracking-[0.34em]"
        >
          <span aria-hidden className="mt-2.5 h-px w-8 shrink-0 bg-gold sm:mt-0 sm:w-12" />
          Exceptional food · Unforgettable occasions
        </motion.p>

        <h1 className="font-serif text-[clamp(2.6rem,13vw,9.5rem)] leading-[0.86] font-medium tracking-[-0.03em] text-ivory uppercase">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span {...rise(0.55)} className="block">
              A feast for
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              {...rise(0.7)}
              className="block font-normal tracking-[-0.02em] text-champagne normal-case italic"
            >
              the senses.
            </motion.span>
          </span>
        </h1>

        <motion.p {...rise(1.0)} className="mt-8 max-w-md text-[15px] leading-7 text-ivory/75">
          Thoughtfully crafted culinary experiences for celebrations, gatherings, and moments worth
          remembering.
        </motion.p>

        <motion.div {...rise(1.15)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/menu"
            className="bg-gold px-7 py-4 text-center text-[11px] font-bold tracking-[0.22em] text-obsidian uppercase transition-colors duration-300 hover:bg-champagne"
          >
            Explore our menu ↗
          </Link>
          <Link
            href="/contact"
            className="border border-gold/80 px-7 py-4 text-center text-[11px] font-bold tracking-[0.22em] text-ivory uppercase transition-colors duration-300 hover:bg-gold/15"
          >
            Plan your event →
          </Link>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to the next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute right-6 bottom-8 hidden flex-col items-center gap-3 text-[10px] font-semibold tracking-[0.3em] text-ivory/60 uppercase [writing-mode:vertical-rl] md:flex lg:right-12"
      >
        Scroll
        <span aria-hidden className="h-14 w-px bg-gradient-to-b from-gold to-transparent" />
      </motion.a>
    </section>
  )
}
