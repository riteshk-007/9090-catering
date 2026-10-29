'use client'

import { useState, useTransition } from 'react'
import { ChevronDown, Loader2, Save, X } from 'lucide-react'
import { ImageField, type UploadedImage } from '@/components/admin/image-field'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DIET_TAGS, type MenuItemView } from '@/lib/menu'
import { cn } from '@/lib/utils'
import { createItem, discardUpload, updateItem } from './actions'
import { ItemExtras, type ItemExtrasValue } from './item-extras'

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

type ItemFormProps = {
  /** Existing dish to edit, or undefined to create a new one */
  item?: MenuItemView
  categoryId: string
  categories: { id: string; name: string }[]
  currency: string
  onDone: () => void
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[:checked]:border-primary/60 has-[:checked]:bg-primary/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-[#d5a64a]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-4">
      <div className="flex items-start gap-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {n}
        </span>
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:pl-9">{children}</div>
    </section>
  )
}

export function ItemForm({ item, categoryId, categories, currency, onDone }: ItemFormProps) {
  const [pending, start] = useTransition()
  const [error, setError] = useState('')
  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [price, setPrice] = useState(item?.price ?? '')
  const [category, setCategory] = useState(item?.categoryId ?? categoryId)
  const [tags, setTags] = useState<string[]>(item?.tags ?? [])
  const [featured, setFeatured] = useState(item?.featured ?? false)
  const [onHome, setOnHome] = useState(item?.onHome ?? false)
  const [available, setAvailable] = useState(item?.available ?? true)
  const [published, setPublished] = useState(item?.published ?? true)
  const [image, setImage] = useState<{ key: string | null; url: string | null }>({
    key: item?.imageKey ?? null,
    url: item?.imageUrl ?? null,
  })
  const [imageAlt, setImageAlt] = useState(item?.imageAlt ?? '')
  const [extras, setExtras] = useState<ItemExtrasValue>({
    labels: item?.labels ?? [],
    variants: item?.variants ?? [],
    serves: item?.serves ?? '',
    spice: item?.spice ?? 0,
    allergens: item?.allergens ?? '',
  })

  const hasMore = !!(
    item &&
    (item.price ||
      item.tags.length ||
      item.labels.length ||
      item.variants.length ||
      item.serves ||
      item.spice ||
      item.allergens ||
      item.featured ||
      item.onHome)
  )
  const [showMore, setShowMore] = useState(hasMore)
  const originalKey = item?.imageKey ?? null

  const onImage = (next: UploadedImage | null) => {
    // An image uploaded during this edit but replaced/removed before saving is no longer needed.
    if (image.key && image.key !== originalKey) discardUpload(image.key)
    setImage(next ?? { key: null, url: null })
  }

  const cancel = () => {
    if (image.key && image.key !== originalKey) discardUpload(image.key)
    onDone()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please enter the dish name.')
    start(async () => {
      const input = {
        ...extras,
        categoryId: category,
        name,
        description,
        price,
        tags,
        featured,
        onHome,
        available,
        published,
        imageKey: image.key,
        imageUrl: image.url,
        imageAlt,
      }
      const r = item ? await updateItem(item.id, input) : await createItem(input)
      if (!r.ok) return setError(r.error)
      onDone()
    })
  }

  const toggleTag = (code: string) =>
    setTags((cur) => (cur.includes(code) ? cur.filter((t) => t !== code) : [...cur, code]))

  return (
    <form
      onSubmit={submit}
      className="grid gap-6 rounded-xl border border-primary/40 bg-background p-4 sm:p-5"
    >
      <div>
        <h3 className="text-base font-semibold">{item ? `Edit “${item.name}”` : 'Add a new dish'}</h3>
        <p className="text-xs text-muted-foreground">
          Fill in the basics. Everything under “More options” is optional.
        </p>
      </div>

      <Step n={1} title="Basics" hint="What guests will see first.">
        <div className="grid gap-2">
          <Label htmlFor="mi-name">Dish name *</Label>
          <Input
            id="mi-name"
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            className="h-9"
            autoFocus
            placeholder="e.g. Pan-seared salmon with herb salsa"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mi-cat">Category</Label>
          <select
            id="mi-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mi-desc">Description</Label>
          <RichTextEditor
            id="mi-desc"
            value={description}
            onChange={setDescription}
            placeholder="Describe the dish: the main ingredients, how it is cooked and what it is served with."
          />
        </div>
        <ImageField url={image.url} onChange={onImage} disabled={pending} label="Photo (recommended)" />
        {image.url && (
          <div className="grid gap-2">
            <Label htmlFor="mi-alt">Photo description (for screen readers)</Label>
            <Input
              id="mi-alt"
              value={imageAlt}
              maxLength={200}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="e.g. Grilled salmon on a white plate with green salsa"
              className="h-9"
            />
          </div>
        )}
      </Step>

      <Step n={2} title="Visibility" hint="Control whether the dish appears on the website.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            label="Show on website"
            hint="Untick to keep it as a draft that visitors cannot see."
            checked={published}
            onChange={setPublished}
          />
          <Toggle
            label="Available"
            hint="Untick to show “Currently unavailable” next to the dish."
            checked={available}
            onChange={setAvailable}
          />
        </div>
      </Step>

      <div className="rounded-lg border border-border">
        <button
          type="button"
          aria-expanded={showMore}
          onClick={() => setShowMore((v) => !v)}
          className="flex w-full items-center justify-between gap-3 p-3 text-left"
        >
          <span>
            <span className="block text-sm font-semibold">More options</span>
            <span className="block text-xs text-muted-foreground">
              Price, dietary tags, portion sizes, labels, spice level, allergens, chef’s pick, home page
            </span>
          </span>
          <ChevronDown
            className={cn(
              'size-5 shrink-0 text-muted-foreground transition-transform',
              showMore && 'rotate-180',
            )}
          />
        </button>

        {showMore && (
          <div className="grid gap-6 border-t border-border p-3 sm:p-4">
            <div className="grid gap-2 sm:max-w-xs">
              <Label htmlFor="mi-price">Price {currency && `(${currency})`}</Label>
              <Input
                id="mi-price"
                value={price}
                maxLength={40}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 450 (leave empty to hide)"
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                Prices only show on the website when “Show prices” is turned on in Menu page settings.
              </p>
            </div>

            <fieldset className="grid gap-2">
              <legend className="mb-1 text-sm font-medium">Dietary and info tags</legend>
              <div className="flex flex-wrap gap-2">
                {DIET_TAGS.map((t) => {
                  const on = tags.includes(t.code)
                  return (
                    <button
                      key={t.code}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleTag(t.code)}
                      className={cn(
                        'min-h-9 rounded-full border px-3 text-xs transition-colors',
                        on
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <b className="mr-1.5">{t.code}</b>
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <ItemExtras value={extras} onChange={setExtras} currency={currency} />

            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle
                label="Chef’s pick"
                hint="Adds a gold “Chef’s pick” label to the dish."
                checked={featured}
                onChange={setFeatured}
              />
              <Toggle
                label="Show on home page"
                hint="Adds the dish to the sliding menu carousel on the home page."
                checked={onHome}
                onChange={setOnHome}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending} className="h-10 px-5">
          {pending ? <Loader2 className="animate-spin" /> : <Save />} {item ? 'Save changes' : 'Add dish'}
        </Button>
        <Button type="button" variant="ghost" disabled={pending} onClick={cancel} className="h-10">
          <X /> Cancel
        </Button>
      </div>
    </form>
  )
}
