'use client'

import { useState } from 'react'
import { Flame, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MAX_LABELS, MAX_VARIANTS, SPICE_LEVELS, type MenuVariant } from '@/lib/menu'
import { cn } from '@/lib/utils'

export type ItemExtrasValue = {
  labels: string[]
  variants: MenuVariant[]
  serves: string
  spice: number
  allergens: string
}

type ItemExtrasProps = {
  value: ItemExtrasValue
  onChange: (next: ItemExtrasValue) => void
  currency: string
}

/** Optional extras for a dish: custom labels, portion options, serving info, spice level, allergens. */
export function ItemExtras({ value, onChange, currency }: ItemExtrasProps) {
  const [draft, setDraft] = useState('')
  const patch = (p: Partial<ItemExtrasValue>) => onChange({ ...value, ...p })

  const addLabel = () => {
    const label = draft.trim().slice(0, 24)
    setDraft('')
    if (!label || value.labels.includes(label) || value.labels.length >= MAX_LABELS) return
    patch({ labels: [...value.labels, label] })
  }

  const setVariant = (i: number, p: Partial<MenuVariant>) =>
    patch({ variants: value.variants.map((v, n) => (n === i ? { ...v, ...p } : v)) })

  return (
    <div className="grid gap-5 rounded-lg border border-border p-4">
      <div>
        <h4 className="text-sm font-medium">Labels, portions and details</h4>
        <p className="text-xs text-muted-foreground">
          All optional. Anything left empty is simply not shown on the website.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ie-label">Custom labels (up to {MAX_LABELS})</Label>
        <div className="flex flex-wrap gap-1.5">
          {value.labels.map((l) => (
            <span
              key={l}
              className="inline-flex items-center gap-1 rounded-full border border-primary/50 bg-primary/10 py-1 pr-1 pl-3 text-xs text-primary"
            >
              {l}
              <button
                type="button"
                aria-label={`Remove label ${l}`}
                onClick={() => patch({ labels: value.labels.filter((x) => x !== l) })}
                className="grid size-5 place-items-center rounded-full hover:bg-primary/20"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="ie-label"
            value={draft}
            maxLength={24}
            disabled={value.labels.length >= MAX_LABELS}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addLabel()
              }
            }}
            placeholder="e.g. New, Seasonal, Signature"
            className="h-9"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            onClick={addLabel}
            disabled={!draft.trim()}
          >
            <Plus /> Add
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Portion or size options</Label>
        {value.variants.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              aria-label={`Option ${i + 1} name`}
              value={v.label}
              maxLength={30}
              onChange={(e) => setVariant(i, { label: e.target.value })}
              placeholder="e.g. Half tray"
              className="h-9 min-w-0 flex-1"
            />
            <Input
              aria-label={`Option ${i + 1} price`}
              value={v.price}
              maxLength={20}
              onChange={(e) => setVariant(i, { price: e.target.value })}
              placeholder={currency ? `Price (${currency})` : 'Price'}
              className="h-9 w-28 shrink-0 sm:w-36"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove option ${i + 1}`}
              className="size-9 shrink-0 text-destructive"
              onClick={() => patch({ variants: value.variants.filter((_, n) => n !== i) })}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {value.variants.length < MAX_VARIANTS && (
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => patch({ variants: [...value.variants, { label: '', price: '' }] })}
            >
              <Plus /> Add option
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="ie-serves">Serving info</Label>
          <Input
            id="ie-serves"
            value={value.serves}
            maxLength={40}
            onChange={(e) => patch({ serves: e.target.value })}
            placeholder="e.g. Serves 4–6"
            className="h-9"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ie-allergens">Allergen information</Label>
          <Input
            id="ie-allergens"
            value={value.allergens}
            maxLength={120}
            onChange={(e) => patch({ allergens: e.target.value })}
            placeholder="e.g. Contains milk, eggs"
            className="h-9"
          />
        </div>
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Spice level</legend>
        <div className="flex flex-wrap gap-2">
          {SPICE_LEVELS.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={value.spice === s.value}
              onClick={() => patch({ spice: s.value })}
              className={cn(
                'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors',
                value.spice === s.value
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {s.value > 0 && (
                <span className="flex" aria-hidden>
                  {Array.from({ length: s.value }).map((_, n) => (
                    <Flame key={n} className="size-3.5" />
                  ))}
                </span>
              )}
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
