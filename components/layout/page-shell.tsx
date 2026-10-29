'use client'

import { MotionConfig } from 'framer-motion'
import { Footer } from './footer'
import { Header } from './header'
import { TranslateLoader } from './translate-loader'

/** Wraps every public page with the shared header and footer, and honours reduced-motion settings. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-obsidian text-ivory">
        <Header />
        <main>{children}</main>
        <Footer />
        <TranslateLoader />
      </div>
    </MotionConfig>
  )
}
