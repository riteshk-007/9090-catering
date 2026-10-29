import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { getMenu, getMenuSettings } from '@/lib/menu-data'
import { r2Configured } from '@/lib/r2'
import { MenuManager } from './menu-manager'

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
  await requireAdmin()
  const [categories, settings] = await Promise.all([getMenu(false), getMenuSettings()])
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Menu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a category, add dishes to it, then drag the ⠿ handles to put things in order. Changes show on
          the website straight away.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Looking for prices, page texts or the home carousel?{' '}
          <Link href="/admin/menu/settings" className="text-primary underline underline-offset-4">
            Open menu page settings
          </Link>
        </p>
      </div>
      <MenuManager initial={categories} settings={settings} r2Ready={r2Configured()} />
    </div>
  )
}
