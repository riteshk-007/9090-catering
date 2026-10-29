'use client'

import { useEffect, useState } from 'react'
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MenuCategoryView, MenuSettingsView } from '@/lib/menu'
import { reorderCategories, sortCategoriesAlphabetically } from './actions'
import { CategoryCard } from './category-card'
import { CategoryForm } from './category-form'

export function MenuManager({
  initial,
  settings,
  r2Ready,
}: {
  initial: MenuCategoryView[]
  settings: MenuSettingsView
  r2Ready: boolean
}) {
  const router = useRouter()
  const [categories, setCategories] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => setCategories(initial), [initial])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const refresh = () => {
    setError('')
    router.refresh()
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const before = categories
    const next = arrayMove(
      before,
      before.findIndex((c) => c.id === active.id),
      before.findIndex((c) => c.id === over.id),
    )
    setCategories(next) // optimistic
    const r = await reorderCategories(next.map((c) => c.id))
    if (!r.ok) {
      setCategories(before)
      setError(r.error)
    }
  }

  const options = categories.map((c) => ({ id: c.id, name: c.name }))

  return (
    <div className="grid gap-6">
      {!r2Ready && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          Cloudflare R2 is not configured, so photos cannot be uploaded.
        </p>
      )}

      <section aria-labelledby="cats-h" className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="cats-h" className="text-base font-medium">
              Categories <span className="text-muted-foreground">({categories.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Drag the handles to reorder categories and dishes. Changes save automatically.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={categories.length < 2}
              onClick={async () => {
                const r = await sortCategoriesAlphabetically()
                if (!r.ok) setError(r.error)
                else refresh()
              }}
            >
              Sort A to Z
            </Button>
            <Button type="button" onClick={() => setAdding(true)} disabled={adding}>
              <Plus /> Add category
            </Button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {adding && (
          <CategoryForm
            onDone={() => {
              setAdding(false)
              refresh()
            }}
          />
        )}

        {categories.length === 0 && !adding ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No categories yet. Add your first category, then add dishes to it.
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <ul className="grid gap-4">
                {categories.map((c, i) => (
                  <CategoryCard
                    key={c.id}
                    index={i}
                    count={categories.length}
                    category={c}
                    categories={options}
                    currency={settings.currency}
                    onChanged={refresh}
                    onError={setError}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  )
}
