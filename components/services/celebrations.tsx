import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { more } from '@/lib/photos'

const occasions = [
  'Wedding receptions and engagement parties',
  'Birthdays, anniversaries and milestone dinners',
  'Festive, cultural and religious celebrations',
  'Baby showers, graduations and family reunions',
]

const included = [
  [
    'Menu planning',
    'Dishes chosen around your style, season and guests, from canapés to multi-course dinners.',
  ],
  ['Dietary care', 'Vegetarian, vegan, gluten-free and allergy-aware options built into the menu.'],
  ['Beautiful presentation', 'Food and platters styled to suit your venue, décor and the mood of the day.'],
]

/** Layout: large photograph on the left, detailed copy on the right (dark). */
export function Celebrations() {
  return (
    <section id="celebrations" className="bg-obsidian">
      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-16 lg:px-12">
        <Reveal className="lg:sticky lg:top-24 lg:col-span-6">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/6]">
            <Photo
              src={more.weddingTable}
              alt="A beautifully dressed celebration table"
              position="50% 55%"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0 lg:col-span-6 lg:pt-4">
          <span className="font-serif text-3xl text-gold italic">01</span>
          <h3 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.02em] text-balance">
            Wedding &amp; Celebration Catering
          </h3>
          <span aria-hidden className="my-6 block h-px w-20 bg-gold" />
          <p className="text-sm leading-7 text-ivory/70 sm:text-[15px] sm:leading-8 lg:text-base">
            Your celebration deserves food that people talk about long after the day. We shape each menu
            around your style, your guests and your venue, whether you imagine elegant canapés, a seated
            dinner or a relaxed table of shared dishes.
          </p>

          <h4 className="mt-8 text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
            Occasions we cater
          </h4>
          <ul className="mt-3 grid gap-2.5 text-sm text-ivory/80">
            {occasions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-gold" />
                {item}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-5 border-t border-gold/25 pt-6">
            {included.map(([term, text]) => (
              <div key={term}>
                <dt className="font-serif text-2xl text-champagne">{term}</dt>
                <dd className="mt-1 text-sm leading-7 text-ivory/60">{text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <TextLink href="/contact" tone="light">
              Enquire about celebrations
            </TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
