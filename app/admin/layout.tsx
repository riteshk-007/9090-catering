import type { Metadata } from 'next'
import { ThemeScope } from '@/components/admin/theme-scope'

export const metadata: Metadata = {
  title: 'Admin — 9090 Catering',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <ThemeScope />
      {children}
    </div>
  )
}
