import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { ALLOWED_IMAGE_TYPES } from '@/lib/gallery'
import { sniffImageType } from '@/lib/image-sniff'
import { MAX_MENU_IMAGE_BYTES } from '@/lib/menu'
import { putImage, r2Configured } from '@/lib/r2'

export const runtime = 'nodejs'

/** Uploads one menu/category image to R2 and returns its key + public URL (the record is saved separately). */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  if (!r2Configured())
    return NextResponse.json({ error: 'Cloudflare R2 is not configured.' }, { status: 500 })

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 })
  if (file.size > MAX_MENU_IMAGE_BYTES)
    return NextResponse.json({ error: 'Image is larger than 6 MB.' }, { status: 413 })

  const buf = Buffer.from(await file.arrayBuffer())
  const type = sniffImageType(buf)
  if (!type || !ALLOWED_IMAGE_TYPES[type]) {
    return NextResponse.json({ error: 'Only JPG, PNG, WebP or AVIF images are allowed.' }, { status: 415 })
  }

  try {
    const { key, url } = await putImage(randomUUID(), ALLOWED_IMAGE_TYPES[type], buf, type, 'menu')
    return NextResponse.json({ ok: true, key, url })
  } catch (err) {
    console.error('Menu image upload failed', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
