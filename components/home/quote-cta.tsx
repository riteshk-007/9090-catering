import Link from 'next/link'
import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { photos } from '@/lib/photos'

/** Conversion section that sends visitors to the enquiry form. */
export function QuoteCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-charcoal">
      <Photo src={photos.cta} alt="A premium steak dish plated for a private dinner" position="60% 50%" />
      <div aria-hidden className="absolute inset-0 bg-obsidian/80" />
      <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 md:py-20 lg:px-12 lg:py-24">
        <Reveal>
          <Eyebrow>Catering enquiries</Eyebrow>
          <h2 className="mt-8 max-w-4xl font-serif text-[clamp(2.6rem,9vw,8rem)] leading-[0.88] font-medium tracking-[-0.03em] uppercase">
            Your occasion.
            <br />
            <em className="font-normal text-champagne normal-case">Our culinary craft.</em>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-ivory/70 sm:text-[15px] sm:leading-8 lg:text-base">
            Tell us about your event, your guests, and the dining experience you have in mind.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block bg-gold px-8 py-5 text-[11px] font-bold tracking-[0.22em] text-obsidian uppercase transition-colors duration-300 hover:bg-champagne"
          >
            Request a catering quote ↗
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
