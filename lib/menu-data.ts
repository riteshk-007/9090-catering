import 'server-only'
import { db } from '@/lib/db'
import type { MenuCategoryView, HomeMenuItem, MenuSettingsView, MenuVariant } from '@/lib/menu'
import { cleanRichText } from '@/lib/sanitize'

function parseVariants(value: unknown): MenuVariant[] {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (v): v is { label: string; price?: string } =>
        !!v && typeof v === 'object' && typeof (v as { label?: unknown }).label === 'string',
    )
    .map((v) => ({ label: v.label, price: typeof v.price === 'string' ? v.price : '' }))
}

export async function getMenuSettings(): Promise<MenuSettingsView> {
  const s = await db.menuSettings.upsert({ where: { id: 'main' }, update: {}, create: { id: 'main' } })
  return {
    showPrices: s.showPrices,
    currency: s.currency,
    introTitle: s.introTitle,
    introText: s.introText,
    footnote: s.footnote,
    carouselEnabled: s.carouselEnabled,
    carouselSeconds: s.carouselSeconds,
  }
}

/** `publicOnly` hides unpublished categories/items for the website; the admin sees everything. */
export async function getMenu(publicOnly: boolean): Promise<MenuCategoryView[]> {
  const rows = await db.menuCategory.findMany({
    where: publicOnly ? { published: true } : {},
    orderBy: { position: 'asc' },
    include: { items: { where: publicOnly ? { published: true } : {}, orderBy: { position: 'asc' } } },
  })
  return rows
    .map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      note: c.note,
      imageKey: publicOnly ? null : c.imageKey,
      imageUrl: c.imageUrl,
      published: c.published,
      items: c.items.map((i) => ({
        id: i.id,
        categoryId: i.categoryId,
        name: i.name,
        description: publicOnly ? cleanRichText(i.description) : i.description,
        price: i.price,
        imageKey: publicOnly ? null : i.imageKey,
        imageUrl: i.imageUrl,
        imageAlt: i.imageAlt,
        tags: i.tags ?? [],
        labels: i.labels ?? [],
        variants: parseVariants(i.variants),
        serves: i.serves,
        spice: i.spice,
        allergens: i.allergens,
        featured: i.featured,
        onHome: i.onHome ?? false,
        available: i.available,
        published: i.published,
      })),
    }))
    .filter((c) => !publicOnly || c.items.length > 0)
}

/** Dishes for the home page carousel: those the admin ticked "Show on home page", else the first few published dishes. */
export async function getHomeMenuItems(limit = 10): Promise<HomeMenuItem[]> {
  const menu = await getMenu(true)
  const all = menu.flatMap((c) => c.items.map((i) => ({ ...i, categoryName: c.name })))
  const picked = all.filter((i) => i.onHome)
  if (picked.length) return picked.slice(0, limit)
  // Nothing ticked yet: prefer dishes that have their own photo so the carousel looks good out of the box.
  const withPhotos = all.filter((i) => i.imageUrl)
  return (withPhotos.length >= 3 ? withPhotos : all).slice(0, limit)
}
