/** Public base URL used for the sitemap, robots.txt and canonical metadata. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/** Public, indexable pages. The admin panel and API are deliberately never listed. */
export const PUBLIC_PAGES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/menu', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
] as const
