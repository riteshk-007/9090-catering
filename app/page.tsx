import type { Metadata } from 'next'
import { HomePage } from '@/components/home/home-page'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: '9090 Catering — A Feast for the Senses',
}

// Re-generated when the admin changes the gallery (revalidatePath), and at most hourly otherwise.
export const revalidate = 3600

export default function Page() {
  return <HomePage />
}
