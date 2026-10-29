'use server'

import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/lib/auth'
import { db } from '@/lib/db'
import { GALLERY_CATEGORIES } from '@/lib/gallery'
import { deleteImage } from '@/lib/r2'

type Result = { ok: true } | { ok: false; error: string }

async function guard(): Promise<Result | null> {
  return (await isAuthenticated()) ? null : { ok: false, error: 'Session expired. Please sign in again.' }
}

const refresh = () => {
  revalidatePath('/')
  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
}

export async function reorderImages(ids: string[]): Promise<Result> {
  const denied = await guard()
  if (denied) return denied
  if (!Array.isArray(ids) || ids.length > 1000 || ids.some((i) => typeof i !== 'string'))
    return { ok: false, error: 'Invalid order.' }
  // Everything is renumbered from the submitted order, so every other image shifts automatically.
  await db.$transaction(
    ids.map((id, position) => db.galleryImage.update({ where: { id }, data: { position } })),
  )
  refresh()
  return { ok: true }
}

export async function updateImage(
  id: string,
  input: { alt: string; category: string; published: boolean },
): Promise<Result> {
  const denied = await guard()
  if (denied) return denied
  const alt = String(input.alt ?? '')
    .trim()
    .slice(0, 200)
  if (!alt) return { ok: false, error: 'Description (alt text) is required.' }
  if (!(GALLERY_CATEGORIES as readonly string[]).includes(input.category))
    return { ok: false, error: 'Invalid category.' }
  await db.galleryImage.update({
    where: { id },
    data: { alt, category: input.category, published: !!input.published },
  })
  refresh()
  return { ok: true }
}

export async function deleteGalleryImage(id: string): Promise<Result> {
  const denied = await guard()
  if (denied) return denied
  const img = await db.galleryImage.findUnique({ where: { id } })
  if (!img) return { ok: true }
  // Remove the file from R2 first; if that fails keep the record so nothing is orphaned silently.
  if (img.key) {
    try {
      await deleteImage(img.key)
    } catch (err) {
      console.error('R2 delete failed', err)
      return { ok: false, error: 'Could not delete the file from Cloudflare R2. Nothing was removed.' }
    }
  }
  await db.galleryImage.delete({ where: { id } })
  // Close the gap so positions stay 0..n-1
  const rest = await db.galleryImage.findMany({ orderBy: { position: 'asc' }, select: { id: true } })
  await db.$transaction(
    rest.map((r, position) => db.galleryImage.update({ where: { id: r.id }, data: { position } })),
  )
  refresh()
  return { ok: true }
}
