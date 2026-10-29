'use client'

import { useEffect, useState, useTransition } from 'react'
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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowDownAZ,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { ActionMenu } from '@/components/admin/action-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MenuCategoryView } from '@/lib/menu'
import { cn } from '@/lib/utils'
import { CategoryForm } from './category-form'
import {
  deleteCategory,
  moveCategory,
  reorderItems,
  sortItemsAlphabetically,
  updateCategory,
} from './actions'
import { ItemForm } from './item-form'
import { ItemRow } from './item-row'

type CategoryCardProps = {
  category: MenuCategoryView
  index: number
  count: number
  categories: { id: string; name: string }[]
  currency: string
  onChanged: () => void
  onError: (message: string) => void
}

export function CategoryCard({
  category,
  index,
  count,
  categories,
  currency,
  onChanged,
  onError,
}: CategoryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  })
  const [open, setOpen] = useState(index === 0)
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [items, setItems] = useState(category.items)
  const [pending, start] = useTransition()

  useEffect(() => setItems(category.items), [category.items])

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
    const r = await reorderItems(
      category.id,
      next.map((i) => i.id),
    )
    if (!r.ok) {
      setItems(before)
      onError(r.error)
    }
  }

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const r = await fn()
      if (!r.ok) onError(r.error ?? 'Something went wrong.')
      else onChanged()
    })

  const toggleVisibility = () =>
    start(async () => {
      const r = await updateCategory(category.id, {
        name: category.name,
        description: category.description ?? '',
        note: category.note ?? '',
        published: !category.published,
        imageKey: category.imageKey,
        imageUrl: category.imageUrl,
      })
      if (!r.ok) onError(r.error)
      else onChanged()
    })

  const remove = () =>
    start(async () => {
      const r = await deleteCategory(category.id)
      setConfirm(false)
      if (!r.ok) onError(r.error)
      else onChanged()
    })

  const done = () => {
    setEditing(false)
    setAdding(false)
    setEditingItem(null)
    onChanged()
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'rounded-xl border border-border bg-card',
        isDragging && 'relative z-10 opacity-80 shadow-2xl ring-2 ring-primary',
      )}
    >
      <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4">
        <button
          type="button"
          aria-label={`Drag to reorder category: ${category.name}`}
          className="grid size-10 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted-foreground hover:bg-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg py-1 text-left"
        >
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform',
              !open && '-rotate-90',
            )}
          />
          <span className="min-w-0 text-base font-medium break-words">{category.name}</span>
          <Badge variant="outline">{items.length}</Badge>
          {!category.published && <Badge variant="secondary">Hidden</Badge>}
        </button>
        <div className="flex w-full flex-wrap gap-1.5 sm:w-auto">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setOpen(true)
              setAdding(true)
              setEditing(false)
            }}
          >
            <Plus /> Add dish
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setEditing(true)
              setAdding(false)
            }}
          >
            <Pencil /> Edit
          </Button>
          <ActionMenu
            label={`More actions for ${category.name}`}
            items={[
              {
                label: category.published ? 'Hide from website' : 'Show on website',
                icon: category.published ? EyeOff : Eye,
                disabled: pending,
                onSelect: toggleVisibility,
              },
              {
                label: 'Move category up',
                icon: ArrowUp,
                disabled: index === 0 || pending,
                onSelect: () => run(() => moveCategory(category.id, 'up')),
              },
              {
                label: 'Move category down',
                icon: ArrowDown,
                disabled: index === count - 1 || pending,
                onSelect: () => run(() => moveCategory(category.id, 'down')),
              },
              {
                label: 'Sort dishes A to Z',
                icon: ArrowDownAZ,
                disabled: items.length < 2 || pending,
                onSelect: () => run(() => sortItemsAlphabetically(category.id)),
              },
              { label: 'Delete category', icon: Trash2, danger: true, onSelect: () => setConfirm(true) },
            ]}
          />
        </div>
      </div>

      {confirm && (
        <div className="mx-3 mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 sm:mx-4">
          <span className="text-sm text-destructive">
            Delete “{category.name}” with all {items.length} dish{items.length === 1 ? '' : 'es'} and their
            photos?
          </span>
          <Button type="button" size="sm" variant="destructive" disabled={pending} onClick={remove}>
            {pending && <Loader2 className="animate-spin" />} Delete everything
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
      )}

      {open && (
        <div className="grid gap-3 border-t border-border p-3 sm:p-4">
          {editing && <CategoryForm category={category} onDone={done} />}
          {adding && (
            <ItemForm categoryId={category.id} categories={categories} currency={currency} onDone={done} />
          )}

          {items.length === 0 && !adding ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No dishes yet. Use “Add dish”.
            </p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <ul className="grid gap-2">
                  {items.map((item) =>
                    editingItem === item.id ? (
                      <li key={item.id}>
                        <ItemForm
                          item={item}
                          categoryId={category.id}
                          categories={categories}
                          currency={currency}
                          onDone={done}
                        />
                      </li>
                    ) : (
                      <ItemRow
                        key={item.id}
                        index={items.indexOf(item)}
                        count={items.length}
                        item={item}
                        currency={currency}
                        onEdit={() => setEditingItem(item.id)}
                        onChanged={onChanged}
                        onError={onError}
                      />
                    ),
                  )}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </li>
  )
}
