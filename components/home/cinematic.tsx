'use client'

import { motion } from 'framer-motion'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { EASE } from '@/lib/motion'
import { photos } from '@/lib/photos'

/** One headline line that slides up from behind a mask when scrolled into view. */
function MaskedLine({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={{ y: '105%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, delay: 0.1 + index * 0.12, ease: EASE }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Full-width cinematic photograph with a campaign-style headline. */
export function Cinematic() {
  return (
    <section
      aria-label="Plan your event"
      className="relative flex min-h-[620px] items-center overflow-hidden bg-obsidian md:min-h-[78vh]"
    >
      <Photo src={photos.banner} alt="An elegant dining table laid for a refined event" position="50% 55%" />
      <div aria-hidden className="absolute inset-0 bg-obsidian/65" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-obsidian/70 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
        <span aria-hidden className="mb-8 block h-px w-24 bg-gold" />
        <h2 className="font-serif text-[clamp(2.4rem,8vw,7.5rem)] leading-[0.9] font-medium tracking-[-0.025em] text-ivory uppercase">
          <MaskedLine index={0}>Good food.</MaskedLine>
          <MaskedLine index={1}>Great company.</MaskedLine>
          <MaskedLine index={2}>
            <em className="font-normal text-champagne normal-case">Unforgettable moments.</em>
          </MaskedLine>
        </h2>
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-sm text-[15px] leading-7 text-ivory/75">
            Make your next occasion feel extraordinary.
          </p>
          <div className="mt-8">
            <TextLink href="/contact" tone="light">
              Let&apos;s plan your event
            </TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
