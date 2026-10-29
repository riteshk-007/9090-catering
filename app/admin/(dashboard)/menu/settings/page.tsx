import { requireAdmin } from '@/lib/auth'
import { getMenuSettings } from '@/lib/menu-data'
import { SettingsForm } from './settings-form'

export const dynamic = 'force-dynamic'

export default async function MenuSettingsPage() {
  await requireAdmin()
  const settings = await getMenuSettings()
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Menu page settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control prices, the texts on the menu page, and the menu carousel on the home page.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
