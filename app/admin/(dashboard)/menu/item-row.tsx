'use client'

import { useState, useTransition } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowDown,
  ArrowUp,
  Ban,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Home,
  Loader2,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react'
import { ActionMenu } from '@/components/admin/action-menu'
import { Photo } from '@/components/common/photo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MenuItemView } from '@/lib/menu'
import { cn } from '@/lib/utils'
import { deleteItem, duplicateItem, moveItem, setItemFlag } from './actions'

type ItemRowProps = {
  item: MenuItemView
  /** Position in the category (0-based) and number of dishes, used to disable Move up/down at the ends */
  index: number
  count: number
  currency: string
  onEdit: () => void
  onChanged: () => void
  onError: (message: string) => void
}

export function ItemRow({ item, index, count, currency, onEdit, onChanged, onError }: ItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const [confirm, setConfirm] = useState(false)
  const [pending, start] = useTransition()

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const r = await fn()
      if (!r.ok) onError(r.error ?? 'Something went wrong.')
      else onChanged()
      setConfirm(false)
    })

  const plainDescription = (item.description ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'rounded-lg border border-border bg-card p-3',
        isDragging && 'relative z-10 opacity-80 shadow-2xl ring-2 ring-primary',
        !item.published && 'opacity-70',
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={`Drag to reorder: ${item.name}`}
          className="grid size-10 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted-foreground hover:bg-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" />
        </button>

        <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted sm:size-16">
          {item.imageUrl && <Photo src={item.imageUrl} alt="" sizes="64px" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">{item.name}</p>
            {item.price && (
              <span className="text-xs text-primary">
                {currency} {item.price}
              </span>
            )}
          </div>
          {plainDescription && (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{plainDescription}</p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.featured && (
              <Badge>
                <Star /> Chef’s pick
              </Badge>
            )}
            {item.onHome && (
              <Badge variant="outline">
                <Home /> Home
              </Badge>
            )}
            {!item.published && <Badge variant="secondary">Draft</Badge>}
            {!item.available && <Badge variant="destructive">Unavailable</Badge>}
            {(item.labels ?? []).map((l) => (
              <Badge key={l} variant="secondary">
                {l}
              </Badge>
            ))}
            {(item.tags ?? []).map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {confirm ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="text-xs text-destructive">
            Delete this dish{item.imageUrl && ' and its photo'}?
          </span>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() => run(() => deleteItem(item.id))}
          >
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
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <Button type="button" size="sm" onClick={onEdit}>
            <Pencil /> Edit
          </Button>
          <ActionMenu
            label={`More actions for ${item.name}`}
            items={[
              {
                label: item.published ? 'Hide from website' : 'Publish to website',
                icon: item.published ? EyeOff : Eye,
                onSelect: () => run(() => setItemFlag(item.id, 'published', !item.published)),
              },
              {
                label: item.available ? 'Mark unavailable' : 'Mark available',
                icon: Ban,
                onSelect: () => run(() => setItemFlag(item.id, 'available', !item.available)),
              },
              {
                label: item.featured ? 'Remove chef’s pick' : 'Make chef’s pick',
                icon: Star,
                onSelect: () => run(() => setItemFlag(item.id, 'featured', !item.featured)),
              },
              {
                label: item.onHome ? 'Remove from home page' : 'Show on home page',
                icon: Home,
                onSelect: () => run(() => setItemFlag(item.id, 'onHome', !item.onHome)),
              },
              {
                label: 'Move up',
                icon: ArrowUp,
                disabled: index === 0,
                onSelect: () => run(() => moveItem(item.id, 'up')),
              },
              {
                label: 'Move down',
                icon: ArrowDown,
                disabled: index === count - 1,
                onSelect: () => run(() => moveItem(item.id, 'down')),
              },
              { label: 'Duplicate', icon: Copy, onSelect: () => run(() => duplicateItem(item.id)) },
              { label: 'Delete', icon: Trash2, danger: true, onSelect: () => setConfirm(true) },
            ]}
          />
          {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Saving" />}
        </div>
      )}
    </li>
  )
}
