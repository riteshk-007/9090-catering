import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'

const steps = [
  {
    title: 'Listen',
    text: 'Every event begins with a conversation about your occasion, your guests, and the feeling you want the day to have.',
  },
  {
    title: 'Design',
    text: 'We shape a menu and a style of service around those details, with room for dietary needs and personal touches.',
  },
  {
    title: 'Prepare',
    text: 'Ingredients are chosen with care and prepared with attention to flavour, texture, and how each dish will look.',
  },
  {
    title: 'Serve',
    text: 'Food is presented beautifully and served with warmth, so you can spend the occasion with the people who matter.',
  },
]

/** A four-step description of how an event comes together. No claims about timings or guarantees. */
export function AboutProcess() {
  return (
    <section className="bg-obsidian">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-balance">
              From first conversation to <em className="font-normal text-champagne">final course.</em>
            </h2>
          </div>
          <p className="text-sm leading-7 text-ivory/60 sm:text-[15px] lg:col-span-4 lg:col-start-9">
            A simple, considered process that keeps the focus on your guests and the food.
          </p>
        </Reveal>

        <ol className="grid gap-px overflow-hidden bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="min-w-0 bg-obsidian">
              <Reveal delay={i * 0.08} className="h-full p-6 sm:p-8">
                <span className="font-serif text-4xl text-gold italic">0{i + 1}</span>
                <h3 className="mt-5 font-serif text-3xl leading-none text-ivory">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ivory/60">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
