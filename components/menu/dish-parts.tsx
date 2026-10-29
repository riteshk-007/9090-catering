import { Flame } from 'lucide-react'
import { SPICE_LEVELS, type MenuSettingsView, tagLabel } from '@/lib/menu'
import { cn } from '@/lib/utils'

/** Styles for the sanitised HTML coming from the admin rich-text editor (dark background). */
export const richTextClass = cn(
  'text-sm leading-7 text-ivory/70 [&_a]:text-champagne [&_a]:underline [&_blockquote]:border-l [&_blockquote]:border-gold/50',
  '[&_blockquote]:pl-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5',
)

export const money = (settings: Pick<MenuSettingsView, 'currency'>, value: string) =>
  `${settings.currency}${settings.currency.length > 1 ? ' ' : ''}${value}`

export function SpiceFlames({ level }: { level: number }) {
  if (level <= 0) return null
  const label = SPICE_LEVELS[level]?.label
  return (
    <span className="inline-flex items-center gap-1 text-champagne" title={label}>
      {Array.from({ length: level }).map((_, n) => (
        <Flame key={n} aria-hidden className="size-3.5" />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <>
      {tags.map((t) => (
        <abbr
          key={t}
          title={tagLabel(t)}
          className="border border-gold/50 px-2 py-0.5 text-[11px] font-semibold tracking-[0.15em] text-champagne no-underline"
        >
          {t}
        </abbr>
      ))}
    </>
  )
}

export function LabelPills({ labels }: { labels: string[] }) {
  return (
    <>
      {labels.map((l) => (
        <span
          key={l}
          className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.12em] text-gold uppercase"
        >
          {l}
        </span>
      ))}
    </>
  )
}
