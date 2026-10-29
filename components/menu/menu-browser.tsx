'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { EASE } from '@/lib/motion'
import {
  SPICE_LEVELS,
  type MenuCategoryView,
  type MenuItemView,
  type MenuSettingsView,
  tagLabel,
} from '@/lib/menu'
import { cn } from '@/lib/utils'

/** Styles for the sanitised HTML coming from the admin rich-text editor. */
const richText = cn(
  'text-sm leading-7 text-ivory/60 [&_a]:text-champagne [&_a]:underline [&_blockquote]:border-l [&_blockquote]:border-gold/50',
  '[&_blockquote]:pl-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5',
)

const money = (settings: MenuSettingsView, value: string) =>
  `${settings.currency}${settings.currency.length > 1 ? ' ' : ''}${value}`

function MenuItem({ item, settings }: { item: MenuItemView; settings: MenuSettingsView }) {
  const showPrice = settings.showPrices && item.price
  return (
    <li className={cn('border-t border-gold/30 py-6 last:border-b', !item.available && 'opacity-60')}>
      <div className="flex items-start gap-4">
        {item.imageUrl && (
          <div className="relative size-20 shrink-0 overflow-hidden sm:size-28">
            <Photo src={item.imageUrl} alt={item.imageAlt || item.name} sizes="112px" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {item.featured && (
            <p className="mb-1 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
              Chef’s pick
            </p>
          )}
          <div className="flex items-baseline justify-between gap-4">
            <h4 className="min-w-0 font-serif text-2xl text-ivory sm:text-3xl">{item.name}</h4>
            {showPrice && (
              <span className="shrink-0 text-sm text-champagne">{money(settings, item.price!)}</span>
            )}
          </div>
          {item.description && (
            <div className={cn('mt-2', richText)} dangerouslySetInnerHTML={{ __html: item.description }} />
          )}
          {(item.variants?.length ?? 0) > 0 && (
            <ul className="mt-3 grid gap-1 text-sm text-ivory/75">
              {(item.variants ?? []).map((v) => (
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
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ivory/55">
              {item.serves && <span>{item.serves}</span>}
              {item.spice > 0 && (
                <span
                  className="inline-flex items-center gap-1 text-champagne"
                  title={SPICE_LEVELS[item.spice]?.label}
                >
                  {Array.from({ length: item.spice }).map((_, n) => (
                    <Flame key={n} aria-hidden className="size-3.5" />
                  ))}
                  <span className="sr-only">{SPICE_LEVELS[item.spice]?.label}</span>
                </span>
              )}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(item.tags ?? []).map((t) => (
              <abbr
                key={t}
                title={tagLabel(t)}
                className="border border-gold/50 px-2 py-0.5 text-[11px] font-semibold tracking-[0.15em] text-champagne no-underline"
              >
                {t}
              </abbr>
            ))}
            {(item.labels ?? []).map((l) => (
              <span
                key={l}
                className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.12em] text-gold uppercase"
              >
                {l}
              </span>
            ))}
            {!item.available && <span className="text-xs text-taupe">Currently unavailable</span>}
          </div>
          {item.allergens && <p className="mt-2 text-xs text-taupe">Allergens: {item.allergens}</p>}
        </div>
      </div>
    </li>
  )
}

export function MenuBrowser({
  categories,
  settings,
}: {
  categories: MenuCategoryView[]
  settings: MenuSettingsView
}) {
  const [active, setActive] = useState('All')
  const shown = active === 'All' ? categories : categories.filter((c) => c.id === active)
  const usedTags = Array.from(new Set(categories.flatMap((c) => c.items.flatMap((i) => i.tags))))

  return (
    <section id="menu-list" className="bg-obsidian">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>Introduction</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-medium tracking-[-0.03em] text-balance">
              {settings.introTitle}
            </h2>
          </div>
          {settings.introText && (
            <div className="lg:col-span-5 lg:col-start-8 lg:pt-14">
              <p className="text-sm leading-7 text-ivory/65 sm:text-[15px] sm:leading-8 lg:text-base">
                {settings.introText}
              </p>
            </div>
          )}
        </Reveal>

        {categories.length === 0 ? (
          <p className="mt-12 text-center text-ivory/60">
            Our menu is being prepared. Please check back soon.
          </p>
        ) : (
          <>
            <div
              role="group"
              aria-label="Menu categories"
              className="mt-10 flex flex-wrap gap-x-1 border-b border-ivory/15"
            >
              {[{ id: 'All', name: 'All' }, ...categories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active === c.id}
                  onClick={() => setActive(c.id)}
                  className={cn(
                    'relative min-h-11 py-3 pr-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors',
                    active === c.id ? 'text-champagne' : 'text-ivory/50 hover:text-ivory',
                  )}
                >
                  {c.name}
                  {active === c.id && (
                    <motion.span layoutId="menu-tab" className="absolute inset-x-0 -bottom-px h-px bg-gold" />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-10 flex flex-col gap-14 md:gap-20"
              >
                {shown.map((category, idx) => (
                  <div key={category.id} className="grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
                    {category.imageUrl && (
                      <div
                        className={cn(
                          'w-full lg:sticky lg:top-24 lg:col-span-5',
                          idx % 2 && 'lg:order-2 lg:col-start-8',
                        )}
                      >
                        {/* The sticky wrapper cannot be the image's parent: next/image "fill" needs a relative one. */}
                        <div className="relative aspect-[4/3] w-full lg:aspect-[4/5]">
                          <Photo
                            src={category.imageUrl}
                            alt={category.name}
                            sizes="(min-width: 1024px) 40vw, 100vw"
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className={cn(
                        'min-w-0',
                        category.imageUrl
                          ? cn('lg:col-span-6', idx % 2 ? 'lg:order-1' : 'lg:col-start-7')
                          : 'lg:col-span-12',
                      )}
                    >
                      <h3 className="font-serif text-4xl text-champagne sm:text-5xl">{category.name}</h3>
                      {category.description && (
                        <p className="mt-2 text-sm text-ivory/55">{category.description}</p>
                      )}
                      {category.note && (
                        <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                          {category.note}
                        </p>
                      )}
                      <ul className={cn('mt-6', !category.imageUrl && 'lg:grid lg:grid-cols-2 lg:gap-x-14')}>
                        {category.items.map((item) => (
                          <MenuItem key={item.id} item={item} settings={settings} />
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {(usedTags.length > 0 || settings.footnote) && (
              <p className="mt-10 text-[11px] leading-5 text-taupe">
                {usedTags.map((t) => `${t} ${tagLabel(t).toLowerCase()}`).join(' · ')}
                {usedTags.length > 0 && settings.footnote && '. '}
                {settings.footnote}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
