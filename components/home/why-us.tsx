import { ChefHat, Leaf, Sparkles, UtensilsCrossed } from 'lucide-react'
import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'

const reasons = [
  {
    icon: UtensilsCrossed,
    title: 'Menus made for you',
    text: 'We start with your occasion and your guests, then build a menu around them. Nothing is one-size-fits-all.',
  },
  {
    icon: ChefHat,
    title: 'Careful preparation',
    text: 'Dishes are prepared with attention to flavour, texture and timing, from the first prep to the final garnish.',
  },
  {
    icon: Sparkles,
    title: 'Beautiful presentation',
    text: 'Plates, platters and buffets are styled with the same care, so the food looks as good as it tastes.',
  },
  {
    icon: Leaf,
    title: 'Dietary needs welcome',
    text: 'Vegetarian, vegan, gluten-free and allergy-aware options can be built into any menu. Just tell us.',
  },
]

/** Four short reasons to choose 9090, in a fine-ruled grid. */
export function WhyUs() {
  return (
    <section className="bg-obsidian">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mb-10 max-w-3xl">
          <Eyebrow>Why 9090</Eyebrow>
          <h2 className="mt-6 font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-balance">
            Food that feels <em className="font-normal text-champagne">considered.</em>
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-ivory/60 sm:text-[15px] sm:leading-8">
            Great catering is part cooking, part care. Here is what you can expect when you work with us.
          </p>
        </Reveal>

        <ul className="grid gap-px overflow-hidden bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <li key={reason.title} className="min-w-0 bg-obsidian">
              <Reveal delay={i * 0.08} className="h-full p-6 sm:p-8">
                <reason.icon aria-hidden className="size-7 text-gold" strokeWidth={1.25} />
                <h3 className="mt-5 font-serif text-3xl leading-tight text-ivory">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ivory/60">{reason.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
