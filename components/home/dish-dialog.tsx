'use client'

import Link from 'next/link'
import { Photo } from '@/components/common/photo'
import { LabelPills, SpiceFlames, TagList, money, richTextClass } from '@/components/menu/dish-parts'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { HomeMenuItem, MenuSettingsView } from '@/lib/menu'
import { cn } from '@/lib/utils'

type DishDialogProps = {
  item: HomeMenuItem | null
  settings: MenuSettingsView
  onClose: () => void
}

/** Full details of one dish, opened from the carousel. */
export function DishDialog({ item, settings, onClose }: DishDialogProps) {
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="border border-gold/30 bg-obsidian text-ivory shadow-2xl"
        closeLabel="Close dish details"
      >
        {item && (
          <div className={cn('grid', item.imageUrl && 'md:grid-cols-2')}>
            {item.imageUrl && (
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
                <Photo
                  src={item.imageUrl}
                  alt={item.imageAlt || item.name}
                  sizes="(min-width: 768px) 384px, 100vw"
                />
              </div>
            )}
            <div className="min-w-0 p-6 sm:p-8">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
                {item.featured ? 'Chef’s pick · ' : ''}
                {item.categoryName}
              </p>
              <DialogTitle className="mt-3 font-serif text-3xl leading-tight text-ivory sm:text-4xl">
                {item.name}
              </DialogTitle>

              {settings.showPrices && item.price && (
                <p className="mt-2 text-lg text-champagne">{money(settings, item.price)}</p>
              )}

              {item.description ? (
                <DialogDescription render={<div />} className={cn('mt-4', richTextClass)}>
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">Details for {item.name}</DialogDescription>
              )}

              {item.variants.length > 0 && (
                <ul className="mt-4 grid gap-1.5 text-sm text-ivory/80">
                  {item.variants.map((v) => (
                    <li key={v.label} className="flex items-baseline gap-3">
                      <span>{v.label}</span>
                      {settings.showPrices && v.price && (
                        <>
                          <span aria-hidden className="h-px flex-1 bg-ivory/15" />
                          <span className="text-champagne">{money(settings, v.price)}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {(item.serves || item.spice > 0) && (
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ivory/60">
                  {item.serves && <span>{item.serves}</span>}
                  <SpiceFlames level={item.spice} />
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <TagList tags={item.tags} />
                <LabelPills labels={item.labels} />
                {!item.available && <span className="text-xs text-taupe">Currently unavailable</span>}
              </div>
              {item.allergens && <p className="mt-3 text-xs text-taupe">Allergens: {item.allergens}</p>}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="bg-gold px-6 py-3.5 text-[11px] font-bold tracking-[0.22em] text-obsidian uppercase transition-colors hover:bg-champagne"
                >
                  Enquire about this dish
                </Link>
                <Link
                  href="/menu"
                  className="border border-gold/60 px-6 py-3.5 text-[11px] font-bold tracking-[0.22em] text-ivory uppercase transition-colors hover:bg-gold/15"
                >
                  Full menu
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
