'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, EyeOff, GripVertical, ImagePlus, Loader2, Pencil, Trash2, UploadCloud, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Photo } from '@/components/common/photo'
import { GALLERY_CATEGORIES, MAX_IMAGE_BYTES } from '@/lib/gallery'
import { cn } from '@/lib/utils'
import { deleteGalleryImage, reorderImages, updateImage } from './actions'

type Img = {
  id: string
  url: string
  alt: string
  category: string
  width: number
  height: number
  published: boolean
  hosted: boolean
}

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

/* ───────────── Upload ───────────── */
type UploadState = { name: string; status: 'pending' | 'uploading' | 'done' | 'error'; message?: string }

async function dimensions(file: File) {
  try {
    const bmp = await createImageBitmap(file)
    const d = { width: bmp.width, height: bmp.height }
    bmp.close()
    return d
  } catch {
    return { width: 1200, height: 800 }
  }
}

function Uploader({ disabled, onDone }: { disabled: boolean; onDone: () => void }) {
  const [category, setCategory] = useState<string>(GALLERY_CATEGORIES[0])
  const [alt, setAlt] = useState('')
  const [items, setItems] = useState<UploadState[]>([])
  const [over, setOver] = useState(false)
  const busy = items.some((i) => i.status === 'pending' || i.status === 'uploading')
  const input = useRef<HTMLInputElement>(null)

  async function upload(files: File[]) {
    if (!files.length || busy || disabled) return
    setItems(files.map((f) => ({ name: f.name, status: 'pending' })))
    const set = (i: number, p: Partial<UploadState>) =>
      setItems((cur) => cur.map((c, n) => (n === i ? { ...c, ...p } : c)))
    for (const [i, f] of files.entries()) {
      if (f.size > MAX_IMAGE_BYTES) {
        set(i, { status: 'error', message: 'Larger than 8 MB' })
        continue
      }
      set(i, { status: 'uploading' })
      const { width, height } = await dimensions(f)
      const fd = new FormData()
      fd.set('file', f)
      fd.set('category', category)
      if (alt.trim() && files.length === 1) fd.set('alt', alt.trim())
      fd.set('width', String(width))
      fd.set('height', String(height))
      try {
        const res = await fetch('/api/admin/gallery', { method: 'POST', body: fd })
        const json = await res.json().catch(() => ({}))
        if (res.ok) set(i, { status: 'done' })
        else set(i, { status: 'error', message: json.error ?? 'Upload failed' })
      } catch {
        set(i, { status: 'error', message: 'Network error' })
      }
    }
    setAlt('')
    onDone()
  }

  return (
    <section aria-labelledby="upload-h" className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <h2 id="upload-h" className="text-base font-medium">
        Add photos
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="up-cat">Category</Label>
          <select
            id="up-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="up-alt">Description (single upload, optional)</Label>
          <Input
            id="up-alt"
            value={alt}
            maxLength={200}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the photo for accessibility"
            className="h-9"
          />
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          upload(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')))
        }}
        className={cn(
          'mt-4 grid place-items-center gap-2 rounded-xl border border-dashed p-8 text-center transition-colors',
          over ? 'border-primary bg-primary/5' : 'border-border',
        )}
      >
        <UploadCloud className="size-8 text-primary" aria-hidden />
        <p className="text-sm">Drag photos here, or</p>
        <Button type="button" disabled={disabled || busy} onClick={() => input.current?.click()}>
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />} Choose photos
        </Button>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP or AVIF · up to 8 MB each</p>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          onChange={(e) => {
            upload(Array.from(e.target.files ?? []))
            e.target.value = ''
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className="mt-4 grid gap-1.5 text-sm" aria-live="polite">
          {items.map((i, n) => (
            <li key={n} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate">{i.name}</span>
              <span
                className={cn(
                  'shrink-0 text-xs',
                  i.status === 'error'
                    ? 'text-destructive'
                    : i.status === 'done'
                      ? 'text-primary'
                      : 'text-muted-foreground',
                )}
              >
                {i.status === 'error'
                  ? i.message
                  : i.status === 'done'
                    ? 'Uploaded'
                    : i.status === 'uploading'
                      ? 'Uploading…'
                      : 'Waiting'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ───────────── Sortable card ───────────── */
function Card({
  img,
  onChanged,
  onError,
}: {
  img: Img
  onChanged: () => void
  onError: (m: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id })
  const [editing, setEditing] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [alt, setAlt] = useState(img.alt)
  const [category, setCategory] = useState(img.category)
  const [published, setPublished] = useState(img.published)
  const [pending, start] = useTransition()

  useEffect(() => {
    setAlt(img.alt)
    setCategory(img.category)
    setPublished(img.published)
  }, [img.alt, img.category, img.published])

  const save = (patch?: Partial<{ published: boolean }>) =>
    start(async () => {
      const r = await updateImage(img.id, { alt, category, published, ...patch })
      if (!r.ok) return onError(r.error)
      setEditing(false)
      onChanged()
    })

  const remove = () =>
    start(async () => {
      const r = await deleteGalleryImage(img.id)
      if (!r.ok) {
        setConfirm(false)
        return onError(r.error)
      }
      onChanged()
    })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-border bg-card',
        isDragging && 'relative z-10 opacity-80 shadow-2xl ring-2 ring-primary',
      )}
    >
      <div className="relative aspect-[4/3] bg-muted">
        <Photo
          src={img.url}
          alt={img.alt}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 100vw"
          className={cn(!img.published && 'opacity-40')}
        />
        <button
          type="button"
          aria-label={`Drag to reorder: ${img.alt}`}
          className="absolute top-2 left-2 grid size-10 cursor-grab touch-none place-items-center rounded-lg bg-background/80 text-foreground backdrop-blur active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" />
        </button>
        {!img.published && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Hidden
          </Badge>
        )}
      </div>

      <div className="grid gap-3 p-3">
        {editing ? (
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor={`alt-${img.id}`}>Description</Label>
              <Input
                id={`alt-${img.id}`}
                value={alt}
                maxLength={200}
                onChange={(e) => setAlt(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`cat-${img.id}`}>Category</Label>
              <select
                id={`cat-${img.id}`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <label className="flex min-h-9 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="size-4 accent-[#d5a64a]"
              />
              Show on public gallery
            </label>
            <div className="flex gap-2">
              <Button type="button" size="sm" disabled={pending} onClick={() => save()}>
                {pending && <Loader2 className="animate-spin" />} Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => setEditing(false)}
              >
                <X /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm">{img.alt}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {img.category}
                {!img.hosted && ' · stock (not in R2)'}
              </p>
            </div>
            {confirm ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-destructive">
                  {img.hosted ? 'Delete photo and its R2 file?' : 'Remove this photo?'}
                </span>
                <Button type="button" size="sm" variant="destructive" disabled={pending} onClick={remove}>
                  {pending && <Loader2 className="animate-spin" />} Delete
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => setConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Pencil /> Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => save({ published: !img.published })}
                >
                  {img.published ? <EyeOff /> : <Eye />} {img.published ? 'Hide' : 'Show'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2 /> Delete
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </li>
  )
}

/* ───────────── Manager ───────────── */
export function GalleryManager({ initial, r2Ready }: { initial: Img[]; r2Ready: boolean }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => setItems(initial), [initial])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const before = items
    const next = arrayMove(
      before,
      before.findIndex((i) => i.id === active.id),
      before.findIndex((i) => i.id === over.id),
    )
    setItems(next) // optimistic
    const r = await reorderImages(next.map((i) => i.id))
    if (!r.ok) {
      setItems(before)
      setError(r.error)
    } else {
      setError('')
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    }
  }

  const refresh = () => router.refresh()

  return (
    <div className="grid gap-8">
      {!r2Ready && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          Cloudflare R2 is not configured. Set the R2 variables in .env.local to enable uploads.
        </p>
      )}
      <Uploader disabled={!r2Ready} onDone={refresh} />

      <section aria-labelledby="list-h">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="list-h" className="text-base font-medium">
            Photos <span className="text-muted-foreground">({items.length})</span>
          </h2>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {saved ? 'Order saved' : 'Drag the handle to reorder. Everything else shifts automatically.'}
          </p>
        </div>
        {error && (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {error}
          </p>
        )}
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No photos yet. Upload your first one above.
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
              <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((img) => (
                  <Card key={img.id} img={img} onChanged={refresh} onError={setError} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  )
}
