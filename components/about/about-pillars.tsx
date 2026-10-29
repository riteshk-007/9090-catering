import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'

const pillars = [
  {
    title: 'Craftsmanship',
    text: 'Ingredients treated with respect and prepared with care, from first prep to final garnish.',
  },
  {
    title: 'Attention to detail',
    text: 'The small things guests rarely name but always feel: temperature, timing, and composition.',
  },
  {
    title: 'Hospitality',
    text: 'Food shaped around your people and your occasion, served so every guest feels considered.',
  },
]

export function AboutPillars() {
  return (
    <section className="bg-sand text-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <Reveal className="mb-14 border-b border-charcoal/20 pb-8">
          <Eyebrow tone="deep">What guides us</Eyebrow>
        </Reveal>
        <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar, i) => (
            <li key={pillar.title} className="min-w-0">
              <Reveal delay={i * 0.1}>
                <span className="font-serif text-3xl text-gold-deep italic">0{i + 1}</span>
                <span aria-hidden className="my-5 block h-px w-16 bg-gold" />
                <h3 className="font-serif text-4xl leading-none">{pillar.title}</h3>
                <p className="mt-4 text-[15px] leading-7 text-charcoal/65">{pillar.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
