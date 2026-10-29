import type { Metadata } from 'next'
import { more } from '@/lib/photos'
import { GalleryBrowser } from '@/components/gallery/gallery-browser'
import { CtaBand } from '@/components/layout/cta-band'
import { PageHero } from '@/components/layout/page-hero'
import { PageShell } from '@/components/layout/page-shell'
import { getGalleryImages } from '@/lib/gallery-data'

export const metadata: Metadata = {
  alternates: { canonical: '/gallery' },
  title: 'Gallery — 9090 Catering',
  description:
    'Plated dishes, platters, culinary preparation, and event dining inspiration from 9090 Catering.',
}

// Re-generated whenever the admin changes the gallery (revalidatePath), and at most hourly otherwise.
export const revalidate = 3600

export default async function GalleryPage() {
  const items = await getGalleryImages()
  return (
    <PageShell>
      <PageHero
        eyebrow="The gallery"
        title={
          <>
            From our <em className="font-normal text-champagne normal-case">table.</em>
          </>
        }
        description="Food, preparation, and tables set for the moments that matter."
        image={more.spread}
        alt="A richly laid table of food in warm light"
      />
      <GalleryBrowser items={items} />
      <CtaBand
        title={
          <>
            Inspired? <em className="font-normal text-champagne normal-case">Let&apos;s talk.</em>
          </>
        }
        text="Tell us about your occasion and the dining experience you have in mind."
        label="Request a catering quote"
      />
    </PageShell>
  )
}
