import type { Metadata } from 'next'
import { CtaBand } from '@/components/layout/cta-band'
import { PageHero } from '@/components/layout/page-hero'
import { PageShell } from '@/components/layout/page-shell'
import { MenuBrowser } from '@/components/menu/menu-browser'
import { getMenu, getMenuSettings } from '@/lib/menu-data'
import { photos } from '@/lib/photos'

export const metadata: Metadata = {
  alternates: { canonical: '/menu' },
  title: 'Menu — 9090 Catering',
  description: 'Browse seasonal dishes, platters, and desserts from 9090 Catering.',
}

// Re-generated whenever the admin changes the menu (revalidatePath), and at most hourly otherwise.
export const revalidate = 3600

export default async function MenuPage() {
  const [categories, settings] = await Promise.all([getMenu(true), getMenuSettings()])
  return (
    <PageShell>
      <PageHero
        eyebrow="The menu"
        title={
          <>
            Seasonal. <em className="font-normal text-champagne normal-case">Considered.</em>
          </>
        }
        description="A selection of the dishes we love to bring to your table."
        image={photos.menuMain}
        alt="A beautifully plated gourmet dish"
      />
      <MenuBrowser categories={categories} settings={settings} />
      <CtaBand
        title={
          <>
            Let&apos;s shape <em className="font-normal text-champagne normal-case">your menu.</em>
          </>
        }
        text="Tell us about your event, your guests, and the dining experience you have in mind."
        label="Request a catering quote"
      />
    </PageShell>
  )
}
