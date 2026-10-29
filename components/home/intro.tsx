import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { photos } from '@/lib/photos'

/** Editorial introduction: large headline beside a tall chef portrait. */
export function Intro() {
  return (
    <section id="about" className="relative overflow-hidden bg-ivory text-charcoal">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-24">
        <Reveal className="lg:col-span-7 lg:pr-12">
          <div className="flex items-center gap-6">
            <span className="font-serif text-2xl text-gold-deep italic">01</span>
            <span aria-hidden className="h-px flex-1 bg-charcoal/20" />
            <Eyebrow tone="deep">The 9090 experience</Eyebrow>
          </div>
          <h2 className="mt-12 font-serif text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.9] font-medium tracking-[-0.03em]">
            Crafted with passion.
            <br />
            <em className="font-normal text-gold-deep">Served with purpose.</em>
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
            <span aria-hidden className="mt-3 hidden h-px w-24 bg-gold sm:block" />
            <div>
              <p className="max-w-md text-sm leading-7 text-charcoal/70 sm:text-[15px] sm:leading-8 lg:text-base">
                From thoughtful menu selections to beautiful food presentation, every detail contributes to an
                occasion worth remembering.
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-charcoal/70 sm:text-[15px] sm:leading-8 lg:text-base">
                9090 Catering brings restaurant-quality food to weddings, corporate events and private
                gatherings. Every menu is shaped around your guests, then prepared with care and presented
                beautifully.
              </p>
              <div className="mt-8">
                <TextLink href="/about">Discover our approach</TextLink>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative lg:col-span-5 lg:pt-24">
          <div className="relative aspect-[3/4] w-full">
            <Photo
              src={photos.chef}
              alt="A chef carefully finishing a plated dish in a professional kitchen"
              position="50% 40%"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <span
            aria-hidden
            className="absolute top-8 -left-3 hidden font-serif text-[11px] tracking-[0.4em] text-gold-deep uppercase [writing-mode:vertical-rl] lg:block"
          >
            Est. in good taste
          </span>
        </Reveal>
      </div>
    </section>
  )
}
