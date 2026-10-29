'use client'

import { useEffect } from 'react'
import { ADMIN_THEME_SCRIPT } from '@/lib/admin-theme'

/**
 * Applies the saved admin theme to <html> before first paint (inline script) and removes it again when the
 * visitor leaves the admin area, so the public website is never affected.
 */
export function ThemeScope() {
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('admin-dark', 'admin-light', 'dark')
    }
  }, [])

  return <script dangerouslySetInnerHTML={{ __html: ADMIN_THEME_SCRIPT }} />
}
