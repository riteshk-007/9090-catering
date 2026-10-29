import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { db } from '@/lib/db'
import { ALLOWED_IMAGE_TYPES, GALLERY_CATEGORIES, MAX_IMAGE_BYTES } from '@/lib/gallery'
import { sniffImageType } from '@/lib/image-sniff'
import { putImage, r2Configured } from '@/lib/r2'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  if (!r2Configured())
    return NextResponse.json({ error: 'Cloudflare R2 is not configured.' }, { status: 500 })

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!form || !(file instanceof File))
    return NextResponse.json({ error: 'No file received.' }, { status: 400 })
  if (file.size > MAX_IMAGE_BYTES)
    return NextResponse.json({ error: 'Image is larger than 8 MB.' }, { status: 413 })

  const buf = Buffer.from(await file.arrayBuffer())
  const type = sniffImageType(buf)
  if (!type || !ALLOWED_IMAGE_TYPES[type]) {
    return NextResponse.json({ error: 'Only JPG, PNG, WebP or AVIF images are allowed.' }, { status: 415 })
  }

  const category = String(form.get('category') ?? '')
  if (!(GALLERY_CATEGORIES as readonly string[]).includes(category)) {
    return NextResponse.json({ error: 'Choose a valid category.' }, { status: 422 })
  }
  const alt =
    String(form.get('alt') ?? '')
      .trim()
      .slice(0, 200) ||
    file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .slice(0, 200)
  const width = Math.min(20000, Math.max(1, Number.parseInt(String(form.get('width')), 10) || 1200))
  const height = Math.min(20000, Math.max(1, Number.parseInt(String(form.get('height')), 10) || 800))

  const id = randomUUID()
  try {
    const { key, url } = await putImage(id, ALLOWED_IMAGE_TYPES[type], buf, type)
    const last = await db.galleryImage.aggregate({ _max: { position: true } })
    const row = await db.galleryImage.create({
      data: { id, key, url, alt, category, width, height, position: (last._max.position ?? -1) + 1 },
    })
    revalidatePath('/')
    revalidatePath('/gallery')
    return NextResponse.json({ ok: true, id: row.id })
  } catch (err) {
    console.error('Gallery upload failed', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
