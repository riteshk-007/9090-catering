'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LOGO } from '@/lib/photos'
import { cn } from '@/lib/utils'

/** The 9090 Catering logo, with a text fallback if the image cannot load. */
export function Logo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className={cn('font-serif text-xl tracking-[0.18em] text-gold', className)}>9090 CATERING</span>
    )
  }

  return (
    <Image
      src={LOGO}
      alt="9090 Catering"
      width={220}
      height={64}
      unoptimized
      priority
      onError={() => setFailed(true)}
      className={cn('h-11 w-auto max-w-[11rem] object-contain sm:h-12 sm:max-w-none', className)}
    />
  )
}
