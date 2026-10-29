/** Shared (client + server) menu constants and types. */
export const DIET_TAGS = [
  { code: 'V', label: 'Vegetarian' },
  { code: 'VG', label: 'Vegan' },
  { code: 'GF', label: 'Gluten free' },
  { code: 'DF', label: 'Dairy free' },
  { code: 'N', label: 'Contains nuts' },
  { code: 'SP', label: 'Spicy' },
  { code: 'H', label: 'Halal' },
] as const

export const tagLabel = (code: string) => DIET_TAGS.find((t) => t.code === code)?.label ?? code

export const MAX_MENU_IMAGE_BYTES = 6 * 1024 * 1024

export type MenuVariant = { label: string; price: string }

export const SPICE_LEVELS = [
  { value: 0, label: 'Not spicy' },
  { value: 1, label: 'Mild' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Hot' },
] as const

export const MAX_LABELS = 5
export const MAX_VARIANTS = 6

export type MenuItemView = {
  id: string
  categoryId: string
  name: string
  description: string | null
  price: string | null
  imageKey: string | null
  imageUrl: string | null
  imageAlt: string | null
  tags: string[]
  labels: string[]
  variants: MenuVariant[]
  serves: string | null
  spice: number
  allergens: string | null
  featured: boolean
  onHome: boolean
  available: boolean
  published: boolean
}

export type HomeMenuItem = MenuItemView & { categoryName: string }

export type MenuCategoryView = {
  id: string
  name: string
  description: string | null
  note: string | null
  imageKey: string | null
  imageUrl: string | null
  published: boolean
  items: MenuItemView[]
}

export type MenuSettingsView = {
  showPrices: boolean
  currency: string
  introTitle: string
  introText: string
  footnote: string
  carouselEnabled: boolean
  carouselSeconds: number
}
