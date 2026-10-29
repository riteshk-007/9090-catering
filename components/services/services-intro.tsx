import { Eyebrow } from '@/components/common/eyebrow'
import { Reveal } from '@/components/common/reveal'

export function ServicesIntro() {
  return (
    <section className="bg-ivory text-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <Reveal className="max-w-4xl">
          <Eyebrow tone="deep">Introduction</Eyebrow>
          <h2 className="mt-8 font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] font-medium tracking-[-0.03em] text-balance">
            Exceptional Catering for Meaningful Occasions
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-charcoal/70 sm:text-[15px] sm:leading-8 lg:text-base">
            Whether intimate or large, each event begins with a conversation. Share your plans and we will
            propose a menu and style to fit them.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-charcoal/70 sm:text-[15px] sm:leading-8 lg:text-base">
            Below you will find the kinds of events we cater, the ways food can be served, how an enquiry
            works, and answers to the questions people ask most.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-semibold tracking-[0.2em] text-gold-deep uppercase">
            <li>
              <a href="#celebrations" className="border-b border-gold-deep/40 pb-1 hover:border-gold-deep">
                Celebrations
              </a>
            </li>
            <li>
              <a href="#corporate" className="border-b border-gold-deep/40 pb-1 hover:border-gold-deep">
                Corporate dining
              </a>
            </li>
            <li>
              <a href="#private" className="border-b border-gold-deep/40 pb-1 hover:border-gold-deep">
                Private events
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
