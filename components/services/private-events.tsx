import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { more } from '@/lib/photos'

const occasions = [
  'Dinner parties and chef-style tasting menus',
  'Family gatherings and festive get-togethers',
  'Garden, terrace and rooftop parties',
  'Intimate celebrations at home',
]

/** Layout: full-bleed photograph with the copy overlaid on a dark gradient. */
export function PrivateEvents() {
  return (
    <section id="private" className="relative flex items-end overflow-hidden bg-obsidian md:min-h-[75vh]">
      <Photo src={more.party} alt="Friends gathered for a private dinner event" />
      <div
        aria-hidden
        className="absolute inset-0 bg-obsidian/75 md:bg-gradient-to-t md:from-obsidian/95 md:via-obsidian/60 md:to-obsidian/30"
      />
      <Reveal className="relative mx-auto grid w-full max-w-[1440px] gap-8 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-12 lg:items-end lg:px-12">
        <div className="lg:col-span-7">
          <span className="font-serif text-3xl text-gold italic">03</span>
          <h3 className="mt-4 max-w-3xl font-serif text-[clamp(2.4rem,7vw,6rem)] leading-[0.9] font-medium tracking-[-0.03em] text-balance uppercase">
            Private Events <em className="font-normal text-champagne normal-case">&amp; Gatherings</em>
          </h3>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/80 sm:text-[15px] sm:leading-8 lg:text-base">
            From a quiet dinner for a few friends to a lively family get-together, we bring restaurant-quality
            food to the place that matters to you. We plan the menu, prepare the food and present it
            beautifully, so you can enjoy your own party.
          </p>
          <div className="mt-8">
            <TextLink href="/contact" tone="light">
              Enquire about private events
            </TextLink>
          </div>
        </div>

        <div className="border-gold/30 lg:col-span-4 lg:col-start-9 lg:border-l lg:pl-8">
          <h4 className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">Popular choices</h4>
          <ul className="mt-3 grid gap-2.5 text-sm text-ivory/85">
            {occasions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
