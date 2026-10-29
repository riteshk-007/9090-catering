'use client'

import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

/** Fades and lifts its content into view the first time it scrolls on screen. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
