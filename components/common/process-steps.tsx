import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'
import { cn } from '@/lib/utils'

export type Step = { title: string; text: string }

type ProcessStepsProps = {
  eyebrow: string
  title: React.ReactNode
  intro?: string
  steps: Step[]
  tone?: 'dark' | 'light'
}

/** Numbered steps in a fine-ruled grid (two columns on tablet, four on desktop). */
export function ProcessSteps({ eyebrow, title, intro, steps, tone = 'dark' }: ProcessStepsProps) {
  const light = tone === 'light'
  return (
    <section className={light ? 'bg-sand text-charcoal' : 'bg-obsidian'}>
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow tone={light ? 'deep' : 'gold'}>{eyebrow}</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-balance">
              {title}
            </h2>
          </div>
          {intro && (
            <p
              className={cn(
                'text-sm leading-7 sm:text-[15px] lg:col-span-4 lg:col-start-9',
                light ? 'text-charcoal/65' : 'text-ivory/60',
              )}
            >
              {intro}
            </p>
          )}
        </Reveal>

        <ol
          className={cn(
            'grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4',
            light ? 'bg-charcoal/15' : 'bg-gold/20',
          )}
        >
          {steps.map((step, i) => (
            <li key={step.title} className={cn('min-w-0', light ? 'bg-sand' : 'bg-obsidian')}>
              <Reveal delay={i * 0.08} className="h-full p-6 sm:p-8">
                <span className={cn('font-serif text-4xl italic', light ? 'text-gold-deep' : 'text-gold')}>
                  0{i + 1}
                </span>
                <h3 className="mt-5 font-serif text-3xl leading-none">{step.title}</h3>
                <p className={cn('mt-3 text-sm leading-7', light ? 'text-charcoal/65' : 'text-ivory/60')}>
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
