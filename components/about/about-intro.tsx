import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'

export function AboutIntro() {
  return (
    <section className="bg-ivory text-charcoal">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20">
        <Reveal className="lg:col-span-4">
          <Eyebrow tone="deep">Introduction</Eyebrow>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <h2 className="max-w-3xl font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-medium tracking-[-0.03em] text-balance">
            The Art of Thoughtful Hospitality
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-charcoal/70 sm:text-[15px] sm:leading-8 lg:text-base">
            Every gathering deserves a table that feels entirely its own. We believe hospitality lives in the
            details: a menu that meets the mood, ingredients handled with care, and food that makes a room
            feel warmer.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-charcoal/70 sm:text-[15px] sm:leading-8 lg:text-base">
            9090 Catering brings together considered menus, careful preparation, and warm service for
            celebrations, corporate occasions, and private gatherings of every size.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
