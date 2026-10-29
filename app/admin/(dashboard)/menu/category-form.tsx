'use client'

import { useState, useTransition } from 'react'
import { Loader2, Save, X } from 'lucide-react'
import { ImageField, type UploadedImage } from '@/components/admin/image-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MenuCategoryView } from '@/lib/menu'
import { createCategory, discardUpload, updateCategory } from './actions'

type CategoryFormProps = {
  category?: MenuCategoryView
  onDone: () => void
}

export function CategoryForm({ category, onDone }: CategoryFormProps) {
  const [pending, start] = useTransition()
  const [error, setError] = useState('')
  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [note, setNote] = useState(category?.note ?? '')
  const [published, setPublished] = useState(category?.published ?? true)
  const [image, setImage] = useState<{ key: string | null; url: string | null }>({
    key: category?.imageKey ?? null,
    url: category?.imageUrl ?? null,
  })
  const originalKey = category?.imageKey ?? null

  const onImage = (next: UploadedImage | null) => {
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
    if (!name.trim()) return setError('Category name is required.')
    start(async () => {
      const input = { name, description, note, published, imageKey: image.key, imageUrl: image.url }
      const r = category ? await updateCategory(category.id, input) : await createCategory(input)
      if (!r.ok) return setError(r.error)
      onDone()
    })
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-xl border border-primary/40 bg-background p-4 sm:p-5"
    >
      <h3 className="text-base font-medium">{category ? 'Edit category' : 'New category'}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="mc-name">Name *</Label>
          <Input
            id="mc-name"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
            className="h-9"
            autoFocus
            placeholder="e.g. Starters & salads"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mc-desc">Short description (optional)</Label>
          <Input
            id="mc-desc"
            value={description}
            maxLength={300}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Light dishes to begin the meal"
            className="h-9"
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="mc-note">Note under the title (optional)</Label>
          <Input
            id="mc-note"
            value={note}
            maxLength={200}
            onChange={(e) => setNote(e.target.value)}
            className="h-9"
            placeholder="e.g. Choose any two, served with bread"
          />
        </div>
      </div>
      <ImageField
        label="Category photo (optional, shown beside the dishes)"
        url={image.url}
        onChange={onImage}
        disabled={pending}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="size-4 accent-[#d5a64a]"
        />
        Show on website
      </label>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}{' '}
          {category ? 'Save changes' : 'Add category'}
        </Button>
        <Button type="button" variant="ghost" disabled={pending} onClick={cancel}>
          <X /> Cancel
        </Button>
      </div>
    </form>
  )
}
