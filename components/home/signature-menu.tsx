import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { photos } from '@/lib/photos'

/** Demonstration dishes. Replace with real menu items; no prices are shown. */
const dishes = [
  { name: 'Charred seasonal vegetables', note: 'Smoked yoghurt, toasted seeds, herb oil', diet: 'V' },
  { name: 'Herb-crusted sea bass', note: 'Lemon beurre blanc, garden herbs', diet: 'GF' },
  { name: 'Dark chocolate & sea salt', note: 'Crème fraîche, cacao nib', diet: 'V' },
] as const

const dietLabel = { V: 'Vegetarian', GF: 'Gluten free' } as const

/** Deep-black section: three sample dishes beside a large layered food photograph. */
export function SignatureMenu() {
  return (
    <section id="menu" className="bg-obsidian">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-12 lg:py-24">
        <Reveal className="lg:col-span-5">
          <Eyebrow>A taste of 9090</Eyebrow>
          <h2 className="mt-8 font-serif text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.88] font-medium tracking-[-0.03em]">
            Simply
            <br />
            <em className="font-normal text-champagne">exceptional.</em>
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-7 text-ivory/60 sm:text-[15px] sm:leading-8 lg:text-base">
            Seasonal ingredients and considered preparation. A sample of the flavours we love to bring to your
            table.
          </p>

          <ul className="mt-12">
            {dishes.map((dish, i) => (
              <li key={dish.name} className="border-t border-gold/30 py-6 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-gold">0{i + 1}</span>
                    <h3 className="font-serif text-2xl text-ivory sm:text-3xl">{dish.name}</h3>
                  </div>
                  <span
                    title={dietLabel[dish.diet]}
                    aria-label={dietLabel[dish.diet]}
                    className="shrink-0 border border-gold/50 px-2 py-0.5 text-[11px] font-semibold tracking-[0.15em] text-champagne"
                  >
                    {dish.diet}
                  </span>
                </div>
                <p className="mt-2 pl-9 text-sm text-ivory/50">{dish.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-taupe">
            Sample menu for illustration. Final dishes are tailored to your event.
          </p>
          <div className="mt-8">
            <TextLink href="/menu" tone="light">
              Explore the menu ↗
            </TextLink>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative lg:col-span-7 lg:pl-12">
          <div className="relative aspect-[4/5] w-full sm:aspect-[5/6]">
            <Photo
              src={photos.menuMain}
              alt="A beautifully plated main course with fresh garnish"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
          <div className="absolute -bottom-10 -left-2 h-40 w-36 border-[10px] border-obsidian sm:-left-8 sm:h-56 sm:w-52 lg:left-0">
            <div className="relative size-full">
              <Photo
                src={photos.menuSmall}
                alt="A fresh seasonal dish served on a ceramic plate"
                sizes="220px"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
