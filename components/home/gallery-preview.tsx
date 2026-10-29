import { getGalleryImages } from '@/lib/gallery-data'
import { GalleryPreviewGrid } from './gallery-preview-grid'

const PREVIEW_COUNT = 4

/**
 * Home page gallery teaser. Photos come from the database, so whatever the admin uploads, orders,
 * hides, or deletes in the admin panel is reflected here automatically.
 */
export async function GalleryPreview() {
  const items = await getGalleryImages(PREVIEW_COUNT)
  if (items.length === 0) return null
  return <GalleryPreviewGrid items={items} />
}
