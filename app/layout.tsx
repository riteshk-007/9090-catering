import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import Script from 'next/script'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: '9090 Catering', type: 'website' },
  title: '9090 Catering — A Feast for the Senses',
  description:
    'Thoughtfully crafted culinary experiences for celebrations, corporate dining, and private events.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#10110f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${manrope.variable}`}>
      <head>
        {/* Language menu support: restores the saved language cookie and stops React crashing when Google edits the page text. Only active for visitors who chose a language. */}
        <Script id="translate-dom-guard" strategy="beforeInteractive">{`
          try {
            var saved = localStorage.getItem("site-language");
            if (saved && saved !== "en" && !/(?:^|; )googtrans=/.test(document.cookie)) {
              document.cookie = "googtrans=/en/" + saved + "; path=/; max-age=31536000; samesite=lax";
            }
          } catch (e) {}
          if (/(?:^|; )googtrans=\\/[^;]+/.test(document.cookie)) {
            var remove = Node.prototype.removeChild;
            Node.prototype.removeChild = function (child) {
              if (child.parentNode !== this) return child;
              return remove.apply(this, arguments);
            };
            var insert = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function (node, ref) {
              if (ref && ref.parentNode !== this) return node;
              return insert.apply(this, arguments);
            };
          }
        `}</Script>
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
