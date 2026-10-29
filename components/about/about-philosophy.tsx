import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { more } from '@/lib/photos'

export function AboutPhilosophy() {
  return (
    <section className="bg-obsidian">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-20">
        <Reveal className="relative aspect-[4/5] lg:col-span-6">
          <Photo
            src={more.chefKitchen}
            alt="A chef at work in a professional kitchen"
            position="50% 40%"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
        <Reveal delay={0.12} className="min-w-0 lg:col-span-5 lg:col-start-8">
          <Eyebrow>Philosophy &amp; presentation</Eyebrow>
          <h2 className="mt-8 font-serif text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.92] font-medium tracking-[-0.03em] text-balance">
            We eat with the eyes <em className="font-normal text-champagne">first.</em>
          </h2>
          <p className="mt-8 text-sm leading-7 text-ivory/65 sm:text-[15px] sm:leading-8 lg:text-base">
            Presentation is part of the flavour. Colour, texture, and space on the plate are composed
            deliberately, so that each dish looks as considered as it tastes, whether it is served at the
            table or on a shared platter.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-ivory/75">
            {[
              'Seasonal, thoughtfully chosen ingredients',
              'Plates composed for colour, texture, and balance',
              'Platters and buffets styled with the same care',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden className="mt-2.5 h-px w-6 shrink-0 bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
