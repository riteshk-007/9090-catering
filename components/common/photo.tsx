'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type PhotoProps = {
  src: string
  alt: string
  className?: string
  /** CSS object-position, e.g. "50% 40%", so the important part of the photo stays visible. */
  position?: string
  priority?: boolean
  sizes?: string
}

/**
 * Fills its (relatively positioned) parent with a photograph.
 * Falls back to a dark panel if the image URL is empty or fails to load.
 */
export function Photo({
  src,
  alt,
  className,
  position = 'center',
  priority = false,
  sizes = '100vw',
}: PhotoProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('absolute inset-0 bg-gradient-to-br from-charcoal to-obsidian', className)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
      style={{ objectPosition: position }}
      className={cn('object-cover', className)}
    />
  )
}
