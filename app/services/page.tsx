import type { Metadata } from 'next'
import { Faq } from '@/components/common/faq'
import { ProcessSteps } from '@/components/common/process-steps'
import { CtaBand } from '@/components/layout/cta-band'
import { PageHero } from '@/components/layout/page-hero'
import { PageShell } from '@/components/layout/page-shell'
import { Celebrations } from '@/components/services/celebrations'
import { CorporateDining } from '@/components/services/corporate-dining'
import { PrivateEvents } from '@/components/services/private-events'
import { ServiceStyles } from '@/components/services/service-styles'
import { ServicesIntro } from '@/components/services/services-intro'
import { photos } from '@/lib/photos'

export const metadata: Metadata = {
  alternates: { canonical: '/services' },
  title: 'Catering Services — 9090 Catering',
  description:
    'Wedding and celebration catering, corporate dining, and private events from 9090 Catering. See how it works and how to enquire.',
}

const steps = [
  {
    title: 'Tell us',
    text: 'Send an enquiry with your date, number of guests, location and the kind of occasion you are planning.',
  },
  {
    title: 'We propose',
    text: 'We suggest a menu and style of service that fit your event, your guests and any dietary needs.',
  },
  {
    title: 'Refine & confirm',
    text: 'Adjust dishes and details together. Your quote and availability are confirmed with you directly.',
  },
  {
    title: 'Enjoy the day',
    text: 'We prepare, present and serve the food so you can relax and enjoy the occasion with your guests.',
  },
]

const faqs = [
  {
    question: 'How far ahead should I enquire?',
    answer:
      'As early as you can, especially for weddings and larger events. An early enquiry gives us time to check availability and plan the menu properly. We confirm availability with you directly after your enquiry.',
  },
  {
    question: 'Can you cater for dietary needs and allergies?',
    answer:
      'Yes. Tell us about vegetarian, vegan, gluten-free, dairy-free or allergy needs when you enquire, and we will shape the menu around them.',
  },
  {
    question: 'Can the menu be customised?',
    answer:
      'Absolutely. The menu on our website is a starting point. We adapt dishes, portions and presentation to your event, and we are happy to talk through ideas or favourite dishes.',
  },
  {
    question: 'What is included in the service?',
    answer:
      'It depends on the event. Tell us what you need, for example a buffet set-up, serving staff or a particular style of service, and we will confirm exactly what is included in your quote.',
  },
  {
    question: 'How is the price worked out?',
    answer:
      'Pricing depends on the menu, the number of guests, the style of service and the location. After you send an enquiry, we will send you a clear quote.',
  },
  {
    question: 'Which areas do you cover?',
    answer: 'Include your event location in the enquiry form and we will confirm whether we can cater there.',
  },
]

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Catering services"
        title={
          <>
            Made for every <em className="font-normal text-champagne normal-case">table.</em>
          </>
        }
        description="Food and presentation shaped around your occasion."
        image={photos.celebrations}
        alt="A long, candlelit event table with flowers and glassware"
        position="50% 60%"
      />
      <ServicesIntro />
      <Celebrations />
      <CorporateDining />
      <PrivateEvents />
      <ServiceStyles />
      <ProcessSteps
        eyebrow="How it works"
        title={
          <>
            From first enquiry to <em className="font-normal text-gold-deep">final course.</em>
          </>
        }
        intro="A simple, clear process that keeps you informed at every step."
        steps={steps}
        tone="light"
      />
      <Faq
        eyebrow="Questions"
        title={
          <>
            Things people <em className="font-normal text-champagne">often ask.</em>
          </>
        }
        intro="If your question is not here, just ask us in your enquiry."
        items={faqs}
      />
      <CtaBand
        title={
          <>
            Plan your <em className="font-normal text-champagne normal-case">event.</em>
          </>
        }
        text="Tell us the occasion, the date, and the number of guests. Details and availability are confirmed with you directly."
        label="Start your enquiry"
      />
    </PageShell>
  )
}
