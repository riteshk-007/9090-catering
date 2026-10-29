import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { more } from '@/lib/photos'

const occasions = [
  'Team lunches and working meetings',
  'Breakfasts and coffee breaks',
  'Client receptions and product launches',
  'Conferences, training days and office parties',
]

const formats = [
  [
    'Individual boxes and bowls',
    'Neatly packed, easy to hand out and easy to eat at a desk or in a meeting room.',
  ],
  ['Buffet service', 'A shared spread of hot and cold dishes for larger teams and relaxed lunches.'],
  ['Canapés and drinks receptions', 'Small, elegant bites for networking events and evening gatherings.'],
]

/** Layout: copy on the left, tall portrait photograph on the right (sand). */
export function CorporateDining() {
  return (
    <section id="corporate" className="bg-sand text-charcoal">
      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-16 lg:px-12">
        <Reveal className="order-2 min-w-0 lg:order-1 lg:col-span-6 lg:pt-4">
          <span className="font-serif text-3xl text-gold-deep italic">02</span>
          <h3 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.02em]">
            Corporate Dining
          </h3>
          <span aria-hidden className="my-6 block h-px w-20 bg-gold-deep" />
          <p className="text-sm leading-7 text-charcoal/75 sm:text-[15px] sm:leading-8 lg:text-base">
            Good food makes meetings, launches and team days run more smoothly. We offer refined, reliable
            catering that looks polished, tastes fresh and is simple to serve, so you can focus on your guests
            and your work.
          </p>

          <h4 className="mt-8 text-[11px] font-semibold tracking-[0.25em] text-gold-deep uppercase">
            Occasions we cater
          </h4>
          <ul className="mt-3 grid gap-2.5 text-sm text-charcoal/80">
            {occasions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-gold-deep" />
                {item}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-5 border-t border-charcoal/20 pt-6">
            {formats.map(([term, text]) => (
              <div key={term}>
                <dt className="font-serif text-2xl text-gold-deep">{term}</dt>
                <dd className="mt-1 text-sm leading-7 text-charcoal/65">{text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <TextLink href="/contact">Enquire about corporate dining</TextLink>
          </div>
        </Reveal>

        <Reveal
          delay={0.1}
          className="order-1 mx-auto w-full max-w-md lg:sticky lg:top-24 lg:order-2 lg:col-span-6 lg:max-w-none"
        >
          <div className="relative aspect-[4/5] lg:aspect-[5/6]">
            <Photo
              src={more.conference}
              alt="A professional business gathering over a meal"
              position="50% 40%"
              sizes="(min-width: 1024px) 50vw, 90vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
