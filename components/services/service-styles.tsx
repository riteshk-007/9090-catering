import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'

const styles = [
  {
    title: 'Buffet',
    text: 'A generous spread of hot and cold dishes that guests enjoy at their own pace. Ideal for larger groups.',
  },
  {
    title: 'Plated dinner',
    text: 'Individually plated courses served at the table, for weddings, formal dinners and special evenings.',
  },
  {
    title: 'Grazing tables',
    text: 'Beautifully arranged boards of cheeses, cured meats, fruit, breads and dips for relaxed sharing.',
  },
  {
    title: 'Canapés & cocktails',
    text: 'Small, elegant bites served standing, perfect for receptions, launches and networking.',
  },
  {
    title: 'Live stations',
    text: 'Chef-attended stations where dishes are finished fresh in front of your guests.',
  },
  {
    title: 'Boxed & individual meals',
    text: 'Neatly packed portions for meetings, working lunches and events where speed and tidiness matter.',
  },
]

/** The ways food can be served, so visitors can picture their own event. */
export function ServiceStyles() {
  return (
    <section className="bg-ivory text-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow tone="deep">Ways to serve</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-balance">
              Choose the style that <em className="font-normal text-gold-deep">suits your day.</em>
            </h2>
          </div>
          <p className="text-sm leading-7 text-charcoal/65 sm:text-[15px] lg:col-span-4 lg:col-start-9">
            Not sure which fits best? Tell us about your event and we will suggest options.
          </p>
        </Reveal>

        <ul className="grid gap-x-10 border-t border-charcoal/20 sm:grid-cols-2 lg:grid-cols-3">
          {styles.map((style, i) => (
            <li key={style.title} className="min-w-0 border-b border-charcoal/20 py-6">
              <Reveal delay={(i % 3) * 0.06}>
                <h3 className="font-serif text-3xl leading-none">{style.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/65">{style.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
