import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { TextLink } from '@/components/common/text-link'
import { more, photos } from '@/lib/photos'

/** Culinary preparation and event dining in an asymmetric photo mosaic. */
export function AboutPhotos() {
  return (
    <section className="bg-obsidian">
      <div className="mx-auto grid max-w-[1440px] gap-4 px-5 pt-12 sm:grid-cols-2 sm:gap-5 sm:px-8 md:pt-16 lg:grid-cols-12 lg:px-12">
        <Reveal className="relative aspect-[4/3] sm:col-span-2 lg:col-span-7 lg:aspect-[16/10]">
          <Photo
            src={more.kitchen}
            alt="Ingredients being prepared in a busy kitchen"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[4/5] lg:col-span-5 lg:row-span-2 lg:aspect-auto">
          <Photo
            src={more.dinnerGroup}
            alt="Guests sharing a meal around a table"
            sizes="(min-width: 1024px) 40vw, 50vw"
          />
        </Reveal>
        <Reveal delay={0.15} className="relative aspect-[4/5] lg:col-span-7 lg:aspect-[16/9]">
          <Photo
            src={photos.banner}
            alt="A refined table set for an event"
            position="50% 55%"
            sizes="(min-width: 1024px) 58vw, 50vw"
          />
        </Reveal>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 pt-10 pb-12 sm:px-8 lg:px-12">
        <TextLink href="/services" tone="light">
          See our catering services
        </TextLink>
      </div>
    </section>
  )
}
