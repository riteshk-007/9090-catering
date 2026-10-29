import { Plus } from 'lucide-react'
import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'
import { cn } from '@/lib/utils'

export type FaqItem = { question: string; answer: string }

type FaqProps = {
  eyebrow?: string
  title: React.ReactNode
  intro?: string
  items: FaqItem[]
  /** "dark" for obsidian backgrounds, "light" for ivory/sand ones */
  tone?: 'dark' | 'light'
}

/** Accessible FAQ accordion built on native <details>, so it works without JavaScript. */
export function Faq({ eyebrow = 'Good to know', title, intro, items, tone = 'dark' }: FaqProps) {
  const light = tone === 'light'
  return (
    <section className={light ? 'bg-ivory text-charcoal' : 'bg-obsidian'}>
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-20">
        <Reveal className="lg:col-span-4">
          <Eyebrow tone={light ? 'deep' : 'gold'}>{eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] font-medium tracking-[-0.03em] text-balance">
            {title}
          </h2>
          {intro && (
            <p
              className={cn(
                'mt-5 max-w-sm text-sm leading-7 sm:text-[15px]',
                light ? 'text-charcoal/65' : 'text-ivory/60',
              )}
            >
              {intro}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          <div className={cn('border-t', light ? 'border-charcoal/20' : 'border-gold/30')}>
            {items.map((item) => (
              <details
                key={item.question}
                className={cn('group border-b', light ? 'border-charcoal/20' : 'border-gold/30')}
              >
                <summary className="flex min-h-14 list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 font-serif text-xl leading-snug sm:text-2xl">{item.question}</span>
                  <Plus
                    aria-hidden
                    className={cn(
                      'size-5 shrink-0 transition-transform duration-300 group-open:rotate-45',
                      light ? 'text-gold-deep' : 'text-gold',
                    )}
                  />
                </summary>
                <p
                  className={cn(
                    'max-w-2xl pb-5 text-sm leading-7 sm:text-[15px] sm:leading-8',
                    light ? 'text-charcoal/70' : 'text-ivory/65',
                  )}
                >
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
