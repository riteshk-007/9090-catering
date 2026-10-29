export const GALLERY_CATEGORIES = [
  'Plated dishes',
  'Platters & buffets',
  'Preparation',
  'Event dining',
] as const
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024

export type GalleryItem = {
  id: string
  url: string
  alt: string
  category: string
  width: number
  height: number
  published: boolean
}
