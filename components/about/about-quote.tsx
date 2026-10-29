import { Reveal } from '@/components/common/reveal'

/** A short statement of intent. This is brand copy, not a customer testimonial. */
export function AboutQuote() {
  return (
    <section className="bg-sand text-charcoal">
      <Reveal className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-8 md:py-16 lg:py-20">
        <span aria-hidden className="mx-auto mb-6 block h-px w-16 bg-gold-deep" />
        <p className="font-serif text-[clamp(1.6rem,4vw,3rem)] leading-[1.15] tracking-[-0.01em] text-balance italic">
          Good food brings people together. Our job is to make that moment feel effortless.
        </p>
        <span aria-hidden className="mx-auto mt-6 block h-px w-16 bg-gold-deep" />
      </Reveal>
    </section>
  )
}
