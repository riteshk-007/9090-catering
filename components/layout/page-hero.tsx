'use client'

import { motion } from 'framer-motion'
import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { EASE } from '@/lib/motion'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: EASE },
})

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  alt,
  position = '50% 50%',
}: {
  eyebrow: string
  title: React.ReactNode
  description?: string
  image: string
  alt: string
  position?: string
}) {
  return (
    <section className="relative flex min-h-[min(100svh,680px)] items-end overflow-hidden bg-obsidian md:min-h-[72vh]">
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0"
      >
        <Photo src={image} alt={alt} position={position} priority />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/50 to-obsidian/15"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-obsidian/40"
      />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pt-32 pb-14 sm:px-8 md:pb-20 lg:px-12">
        <motion.div {...rise(0.3)}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
        <motion.h1
          {...rise(0.45)}
          className="mt-6 max-w-5xl font-serif text-[clamp(2.6rem,10vw,8rem)] leading-[0.88] font-medium tracking-[-0.03em] text-balance text-ivory uppercase"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p {...rise(0.7)} className="mt-7 max-w-md text-[15px] leading-7 text-ivory/75">
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}
