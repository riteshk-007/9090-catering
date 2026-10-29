import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { r2Configured } from '@/lib/r2'
import { GalleryManager } from './gallery-manager'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  await requireAdmin()
  const images = await db.galleryImage.findMany({ orderBy: { position: 'asc' } })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload photos, drag to reorder, and edit or delete them. Changes appear on the public gallery
          straight away.
        </p>
      </div>
      <GalleryManager
        r2Ready={r2Configured()}
        initial={images.map((i) => ({
          id: i.id,
          url: i.url,
          alt: i.alt,
          category: i.category,
          width: i.width,
          height: i.height,
          published: i.published,
          hosted: !!i.key,
        }))}
      />
    </div>
  )
}
