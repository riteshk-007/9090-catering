import { PageShell } from '@/components/layout/page-shell'
import { Cinematic } from './cinematic'
import { Experiences } from './experiences'
import { GalleryPreview } from './gallery-preview'
import { Hero } from './hero'
import { HomeFaq } from './home-faq'
import { HomeProcess } from './home-process'
import { Intro } from './intro'
import { MenuCarousel } from './menu-carousel'
import { QuoteCta } from './quote-cta'
import { SignatureMenu } from './signature-menu'
import { WhyUs } from './why-us'

/** The home page: each section is its own component in this folder. */
export function HomePage() {
  return (
    <PageShell>
      <Hero />
      <Intro />
      <SignatureMenu />
      <MenuCarousel />
      <Experiences />
      <WhyUs />
      <Cinematic />
      <HomeProcess />
      <GalleryPreview />
      <HomeFaq />
      <QuoteCta />
    </PageShell>
  )
}
