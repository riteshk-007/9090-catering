'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MenuSettingsView } from '@/lib/menu'
import { saveSettings } from '../actions'

function Switch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[:checked]:border-primary/60 has-[:checked]:bg-primary/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-[#d5a64a]"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

export function SettingsForm({ settings }: { settings: MenuSettingsView }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(settings)

  const set = <K extends keyof MenuSettingsView>(key: K, value: MenuSettingsView[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    start(async () => {
      const r = await saveSettings(form)
      if (!r.ok) return setError(r.error)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Prices</CardTitle>
          <CardDescription>
            Keep prices hidden until they are confirmed. Dishes without a price never show one.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Switch
            label="Show prices on the website"
            hint="Turn on once your prices are final. You enter each price when you edit a dish."
            checked={form.showPrices}
            onChange={(v) => set('showPrices', v)}
          />
          <div className="grid max-w-xs gap-2">
            <Label htmlFor="ms-cur">Currency symbol</Label>
            <Input
              id="ms-cur"
              value={form.currency}
              maxLength={8}
              onChange={(e) => set('currency', e.target.value)}
              placeholder="e.g. ₹ or $"
              className="h-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Texts on the menu page</CardTitle>
          <CardDescription>The heading and paragraph above the menu, and the note below it.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ms-title">Heading</Label>
            <Input
              id="ms-title"
              value={form.introTitle}
              maxLength={120}
              onChange={(e) => set('introTitle', e.target.value)}
              className="h-9"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-intro">Introduction</Label>
            <textarea
              id="ms-intro"
              rows={4}
              maxLength={600}
              value={form.introText}
              onChange={(e) => set('introText', e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-foot">Note below the menu</Label>
            <Input
              id="ms-foot"
              value={form.footnote}
              maxLength={300}
              onChange={(e) => set('footnote', e.target.value)}
              className="h-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Home page carousel</CardTitle>
          <CardDescription>
            Dishes marked “Show on home” appear in the sliding carousel on the home page. If none are marked,
            the first dishes with photos are used.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Switch
            label="Show the menu carousel on the home page"
            hint="Turn off to hide the whole section."
            checked={form.carouselEnabled}
            onChange={(v) => set('carouselEnabled', v)}
          />
          <div className="grid max-w-xs gap-2">
            <Label htmlFor="ms-secs">Seconds per slide (2 to 12)</Label>
            <Input
              id="ms-secs"
              type="number"
              min={2}
              max={12}
              value={form.carouselSeconds}
              onChange={(e) => set('carouselSeconds', Number(e.target.value))}
              onBlur={(e) =>
                set('carouselSeconds', Math.min(12, Math.max(2, Math.trunc(Number(e.target.value)) || 4)))
              }
              className="h-9"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="sticky bottom-4 z-10 flex">
        <Button type="submit" size="lg" disabled={pending} className="h-11 px-6 shadow-lg">
          {pending ? <Loader2 className="animate-spin" /> : saved ? <Check /> : null}{' '}
          {saved ? 'Saved' : 'Save settings'}
        </Button>
      </div>
    </form>
  )
}
