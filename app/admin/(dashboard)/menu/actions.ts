'use server'

import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/lib/auth'
import { db } from '@/lib/db'
import { DIET_TAGS, MAX_LABELS, MAX_VARIANTS, type MenuVariant } from '@/lib/menu'
import { deleteImage } from '@/lib/r2'
import { cleanRichText } from '@/lib/sanitize'

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string }

const DENIED = { ok: false as const, error: 'Session expired. Please sign in again.' }

const refresh = () => {
  revalidatePath('/')
  revalidatePath('/menu')
  revalidatePath('/admin/menu')
}

/** Best-effort R2 cleanup: a failed delete is logged but never blocks the database change. */
async function dropFile(key: string | null | undefined) {
  if (!key) return
  try {
    await deleteImage(key)
  } catch (err) {
    console.error('R2 delete failed', key, err)
  }
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/* ───────────── Categories ───────────── */
export type CategoryInput = {
  name: string
  description: string
  note: string
  published: boolean
  imageKey: string | null
  imageUrl: string | null
}

export async function createCategory(input: CategoryInput): Promise<Result<{ id: string }>> {
  if (!(await isAuthenticated())) return DENIED
  const name = text(input.name, 80)
  if (!name) return { ok: false, error: 'Category name is required.' }
  const last = await db.menuCategory.aggregate({ _max: { position: true } })
  const row = await db.menuCategory.create({
    data: {
      name,
      description: text(input.description, 300) || null,
      note: text(input.note, 200) || null,
      published: !!input.published,
      imageKey: input.imageKey,
      imageUrl: input.imageUrl,
      position: (last._max.position ?? -1) + 1,
    },
  })
  refresh()
  return { ok: true, id: row.id }
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const name = text(input.name, 80)
  if (!name) return { ok: false, error: 'Category name is required.' }
  const old = await db.menuCategory.findUnique({ where: { id }, select: { imageKey: true } })
  if (!old) return { ok: false, error: 'Category not found.' }
  await db.menuCategory.update({
    where: { id },
    data: {
      name,
      description: text(input.description, 300) || null,
      note: text(input.note, 200) || null,
      published: !!input.published,
      imageKey: input.imageKey,
      imageUrl: input.imageUrl,
    },
  })
  if (old.imageKey && old.imageKey !== input.imageKey) await dropFile(old.imageKey)
  refresh()
  return { ok: true }
}

export async function deleteCategory(id: string): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const cat = await db.menuCategory.findUnique({
    where: { id },
    include: { items: { select: { imageKey: true } } },
  })
  if (!cat) return { ok: true }
  await db.menuCategory.delete({ where: { id } }) // items are removed by the cascade
  await Promise.all([cat.imageKey, ...cat.items.map((i) => i.imageKey)].map(dropFile))
  await renumber('category')
  refresh()
  return { ok: true }
}

export async function reorderCategories(ids: string[]): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  if (!Array.isArray(ids) || ids.length > 500) return { ok: false, error: 'Invalid order.' }
  await db.$transaction(
    ids.map((id, position) => db.menuCategory.update({ where: { id }, data: { position } })),
  )
  refresh()
  return { ok: true }
}

/* ───────────── Items ───────────── */
export type ItemInput = {
  categoryId: string
  name: string
  description: string
  price: string
  tags: string[]
  labels: string[]
  variants: MenuVariant[]
  serves: string
  spice: number
  allergens: string
  featured: boolean
  onHome: boolean
  available: boolean
  published: boolean
  imageKey: string | null
  imageUrl: string | null
  imageAlt: string
}

function cleanItem(input: ItemInput) {
  const validTags = new Set<string>(DIET_TAGS.map((t) => t.code))
  return {
    categoryId: input.categoryId,
    name: text(input.name, 120),
    description: cleanRichText(input.description),
    price: text(input.price, 40) || null,
    tags: (input.tags ?? []).filter((t) => validTags.has(t)),
    labels: Array.from(new Set((input.labels ?? []).map((l) => text(l, 24)).filter(Boolean))).slice(
      0,
      MAX_LABELS,
    ),
    variants: (input.variants ?? [])
      .map((v) => ({ label: text(v.label, 30), price: text(v.price, 20) }))
      .filter((v) => v.label)
      .slice(0, MAX_VARIANTS),
    serves: text(input.serves, 40) || null,
    spice: Math.min(3, Math.max(0, Math.trunc(Number(input.spice)) || 0)),
    allergens: text(input.allergens, 120) || null,
    featured: !!input.featured,
    onHome: !!input.onHome,
    available: !!input.available,
    published: !!input.published,
    imageKey: input.imageKey,
    imageUrl: input.imageUrl,
    imageAlt: text(input.imageAlt, 200) || null,
  }
}

export async function createItem(input: ItemInput): Promise<Result<{ id: string }>> {
  if (!(await isAuthenticated())) return DENIED
  const data = cleanItem(input)
  if (!data.name) return { ok: false, error: 'Dish name is required.' }
  if (!(await db.menuCategory.findUnique({ where: { id: data.categoryId }, select: { id: true } }))) {
    return { ok: false, error: 'Choose a valid category.' }
  }
  const last = await db.menuItem.aggregate({
    where: { categoryId: data.categoryId },
    _max: { position: true },
  })
  const row = await db.menuItem.create({ data: { ...data, position: (last._max.position ?? -1) + 1 } })
  refresh()
  return { ok: true, id: row.id }
}

export async function updateItem(id: string, input: ItemInput): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const data = cleanItem(input)
  if (!data.name) return { ok: false, error: 'Dish name is required.' }
  const old = await db.menuItem.findUnique({ where: { id }, select: { imageKey: true, categoryId: true } })
  if (!old) return { ok: false, error: 'Dish not found.' }
  let position: number | undefined
  if (old.categoryId !== data.categoryId) {
    // Moved to another category: put it at the end there.
    const last = await db.menuItem.aggregate({
      where: { categoryId: data.categoryId },
      _max: { position: true },
    })
    position = (last._max.position ?? -1) + 1
  }
  await db.menuItem.update({ where: { id }, data: { ...data, ...(position !== undefined && { position }) } })
  if (old.imageKey && old.imageKey !== data.imageKey) await dropFile(old.imageKey)
  if (position !== undefined) await renumber('item', old.categoryId)
  refresh()
  return { ok: true }
}

export async function setItemFlag(
  id: string,
  flag: 'published' | 'available' | 'featured' | 'onHome',
  value: boolean,
): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  if (!['published', 'available', 'featured', 'onHome'].includes(flag))
    return { ok: false, error: 'Invalid option.' }
  await db.menuItem.update({ where: { id }, data: { [flag]: value } })
  refresh()
  return { ok: true }
}

export async function duplicateItem(id: string): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const src = await db.menuItem.findUnique({ where: { id } })
  if (!src) return { ok: false, error: 'Dish not found.' }
  const { id: _id, createdAt: _c, updatedAt: _u, imageKey: _k, position, name, variants, ...rest } = src
  // The copy shares the image URL but not the R2 key, so deleting one never removes the other's file.
  await db.$transaction([
    db.menuItem.updateMany({
      where: { categoryId: src.categoryId, position: { gt: position } },
      data: { position: { increment: 1 } },
    }),
    db.menuItem.create({
      data: {
        ...rest,
        name: `${name} (copy)`.slice(0, 120),
        published: false,
        imageKey: null,
        position: position + 1,
      },
    }),
  ])
  refresh()
  return { ok: true }
}

export async function deleteItem(id: string): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const item = await db.menuItem.findUnique({ where: { id }, select: { imageKey: true, categoryId: true } })
  if (!item) return { ok: true }
  await db.menuItem.delete({ where: { id } })
  await dropFile(item.imageKey)
  await renumber('item', item.categoryId)
  refresh()
  return { ok: true }
}

export async function reorderItems(categoryId: string, ids: string[]): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  if (!Array.isArray(ids) || ids.length > 1000) return { ok: false, error: 'Invalid order.' }
  await db.$transaction(
    ids.map((id, position) => db.menuItem.update({ where: { id, categoryId }, data: { position } })),
  )
  refresh()
  return { ok: true }
}

/** Removes an uploaded-but-never-saved image (for example when the editor is cancelled). */
export async function discardUpload(key: string): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const inUse =
    (await db.menuItem.count({ where: { imageKey: key } })) +
    (await db.menuCategory.count({ where: { imageKey: key } }))
  if (!inUse) await dropFile(key)
  return { ok: true }
}

/* ───────────── Settings ───────────── */
export type SettingsInput = {
  showPrices: boolean
  currency: string
  introTitle: string
  introText: string
  footnote: string
  carouselEnabled: boolean
  carouselSeconds: number
}

export async function saveSettings(input: SettingsInput): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const data = {
    showPrices: !!input.showPrices,
    currency: text(input.currency, 8),
    introTitle: text(input.introTitle, 120) || 'A Taste Worth Remembering',
    introText: text(input.introText, 600),
    footnote: text(input.footnote, 300),
    carouselEnabled: !!input.carouselEnabled,
    carouselSeconds: Math.min(12, Math.max(2, Math.trunc(Number(input.carouselSeconds)) || 4)),
  }
  await db.menuSettings.upsert({ where: { id: 'main' }, update: data, create: { id: 'main', ...data } })
  refresh()
  return { ok: true }
}

/* ───────────── helpers ───────────── */
async function renumber(kind: 'category'): Promise<void>
async function renumber(kind: 'item', categoryId: string): Promise<void>
async function renumber(kind: 'category' | 'item', categoryId?: string) {
  if (kind === 'category') {
    const rows = await db.menuCategory.findMany({ orderBy: { position: 'asc' }, select: { id: true } })
    await db.$transaction(
      rows.map((r, position) => db.menuCategory.update({ where: { id: r.id }, data: { position } })),
    )
  } else {
    const rows = await db.menuItem.findMany({
      where: { categoryId },
      orderBy: { position: 'asc' },
      select: { id: true },
    })
    await db.$transaction(
      rows.map((r, position) => db.menuItem.update({ where: { id: r.id }, data: { position } })),
    )
  }
}

/* ───────────── Easy ordering (alternatives to dragging) ───────────── */
export async function moveItem(id: string, direction: 'up' | 'down'): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const item = await db.menuItem.findUnique({ where: { id }, select: { categoryId: true } })
  if (!item) return { ok: false, error: 'Dish not found.' }
  const rows = await db.menuItem.findMany({
    where: { categoryId: item.categoryId },
    orderBy: { position: 'asc' },
    select: { id: true },
  })
  const ids = rows.map((r) => r.id)
  const from = ids.indexOf(id)
  const to = direction === 'up' ? from - 1 : from + 1
  if (to < 0 || to >= ids.length) return { ok: true }
  ;[ids[from], ids[to]] = [ids[to], ids[from]]
  await db.$transaction(
    ids.map((i, position) => db.menuItem.update({ where: { id: i }, data: { position } })),
  )
  refresh()
  return { ok: true }
}

export async function moveCategory(id: string, direction: 'up' | 'down'): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const rows = await db.menuCategory.findMany({ orderBy: { position: 'asc' }, select: { id: true } })
  const ids = rows.map((r) => r.id)
  const from = ids.indexOf(id)
  const to = direction === 'up' ? from - 1 : from + 1
  if (from < 0 || to < 0 || to >= ids.length) return { ok: true }
  ;[ids[from], ids[to]] = [ids[to], ids[from]]
  await db.$transaction(
    ids.map((i, position) => db.menuCategory.update({ where: { id: i }, data: { position } })),
  )
  refresh()
  return { ok: true }
}

/** Puts a category's dishes in A–Z order. */
export async function sortItemsAlphabetically(categoryId: string): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const rows = await db.menuItem.findMany({ where: { categoryId }, select: { id: true, name: true } })
  rows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  await db.$transaction(
    rows.map((r, position) => db.menuItem.update({ where: { id: r.id }, data: { position } })),
  )
  refresh()
  return { ok: true }
}

/** Puts all categories in A–Z order. */
export async function sortCategoriesAlphabetically(): Promise<Result> {
  if (!(await isAuthenticated())) return DENIED
  const rows = await db.menuCategory.findMany({ select: { id: true, name: true } })
  rows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  await db.$transaction(
    rows.map((r, position) => db.menuCategory.update({ where: { id: r.id }, data: { position } })),
  )
  refresh()
  return { ok: true }
}
