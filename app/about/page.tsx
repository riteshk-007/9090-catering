import type { Metadata } from 'next'
import { AboutIntro } from '@/components/about/about-intro'
import { AboutPhilosophy } from '@/components/about/about-philosophy'
import { AboutPhotos } from '@/components/about/about-photos'
import { AboutPillars } from '@/components/about/about-pillars'
import { AboutProcess } from '@/components/about/about-process'
import { AboutQuote } from '@/components/about/about-quote'
import { CtaBand } from '@/components/layout/cta-band'
import { PageHero } from '@/components/layout/page-hero'
import { PageShell } from '@/components/layout/page-shell'
import { more } from '@/lib/photos'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About — 9090 Catering',
  description: 'The art of thoughtful hospitality: the philosophy and craft behind 9090 Catering.',
}

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The 9090 philosophy"
        title={
          <>
            The art of
            <br />
            <em className="font-normal text-champagne normal-case">thoughtful hospitality.</em>
          </>
        }
        description="A considered approach to food, atmosphere, and the moments shared around a table."
        image={more.restaurant}
        alt="An elegant restaurant dining room set for service"
        position="50% 60%"
      />
      <AboutIntro />
      <AboutPhilosophy />
      <AboutPillars />
      <AboutProcess />
      <AboutQuote />
      <AboutPhotos />
      <CtaBand
        title={
          <>
            Discover the <em className="font-normal text-champagne normal-case">9090 experience.</em>
          </>
        }
        text="Tell us about your occasion and we will shape a table around it."
        label="Discover the 9090 experience"
      />
    </PageShell>
  )
}
