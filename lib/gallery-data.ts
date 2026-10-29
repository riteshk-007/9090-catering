import 'server-only'
import { db } from '@/lib/db'
import type { GalleryItem } from '@/lib/gallery'

/** Published gallery photos in the order set in the admin panel. Pass `limit` for previews. */
export async function getGalleryImages(limit?: number): Promise<GalleryItem[]> {
  const rows = await db.galleryImage.findMany({
    where: { published: true },
    orderBy: { position: 'asc' },
    ...(limit ? { take: limit } : {}),
  })
  return rows.map((r) => ({
    id: r.id,
    url: r.url,
    alt: r.alt,
    category: r.category,
    width: r.width,
    height: r.height,
    published: r.published,
  }))
}
