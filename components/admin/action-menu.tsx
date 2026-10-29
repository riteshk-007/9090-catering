'use client'

import { useState } from 'react'
import { MoreHorizontal, type LucideIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type ActionMenuItem = {
  label: string
  icon?: LucideIcon
  onSelect: () => void
  danger?: boolean
  disabled?: boolean
}

/** "More" dropdown that keeps rarely used actions out of the way. */
export function ActionMenu({ items, label = 'More actions' }: { items: ActionMenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={label}
        className="inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-transparent px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-muted"
      >
        <MoreHorizontal className="size-3.5" aria-hidden /> More
      </PopoverTrigger>
      <PopoverContent
        align="end"
        initialFocus={false}
        className="w-56 border-border bg-card p-1 text-foreground"
        aria-label={label}
      >
        <ul role="menu">
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false)
                  item.onSelect()
                }}
                className={cn(
                  'flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50',
                  item.danger && 'text-destructive hover:bg-destructive/10',
                )}
              >
                {item.icon && <item.icon className="size-4 shrink-0" aria-hidden />}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
