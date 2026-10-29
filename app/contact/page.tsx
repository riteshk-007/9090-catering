import type { Metadata } from 'next'
import { Eyebrow } from '@/components/common/eyebrow'
import { Photo } from '@/components/common/photo'
import { Reveal } from '@/components/common/reveal'
import { ContactForm } from '@/components/contact/contact-form'
import { more } from '@/lib/photos'
import { PageHero } from '@/components/layout/page-hero'
import { PageShell } from '@/components/layout/page-shell'

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact — 9090 Catering',
  description: 'Tell us about your occasion and the dining experience you have in mind.',
}

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s create something <em className="font-normal text-champagne normal-case">memorable.</em>
          </>
        }
        description="Tell us about your occasion and the dining experience you have in mind."
        image={more.interior}
        alt="A warmly lit restaurant interior with set tables"
      />
      <section id="enquiry" className="bg-ivory text-charcoal">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <Reveal className="min-w-0 lg:col-span-7">
            <Eyebrow tone="deep">Catering enquiry</Eyebrow>
            <h2 className="mt-6 mb-10 font-serif text-4xl leading-none sm:text-5xl">
              Request a catering quote
            </h2>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.12} className="min-w-0 lg:col-span-4 lg:col-start-9">
            <div className="relative mb-8 aspect-[4/3] w-full lg:aspect-[4/5]">
              <Photo
                src={more.drinks}
                alt="A beautifully prepared table of food and drink"
                sizes="(min-width:1024px) 33vw, 100vw"
              />
            </div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-gold-deep uppercase">
              Contact details
            </p>
            <p className="mt-3 text-sm leading-7 text-charcoal/60">
              Phone, email, and location details will be shown here once supplied.
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
