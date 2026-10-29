'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { Photo } from '@/components/common/photo'
import { Button } from '@/components/ui/button'
import { MAX_MENU_IMAGE_BYTES } from '@/lib/menu'

export type UploadedImage = { key: string; url: string }

type ImageFieldProps = {
  url: string | null
  onChange: (image: UploadedImage | null) => void
  disabled?: boolean
  label?: string
}

/** Uploads straight to Cloudflare R2 through the admin API and reports the new key + URL. */
export function ImageField({ url, onChange, disabled, label = 'Photo' }: ImageFieldProps) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function upload(file: File | undefined) {
    if (!file) return
    setError('')
    if (file.size > MAX_MENU_IMAGE_BYTES) return setError('Image is larger than 6 MB.')
    setBusy(true)
    try {
      const fd = new FormData()
      fd.set('file', file)
      const res = await fetch('/api/admin/menu/image', { method: 'POST', body: fd })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) return setError(json.error ?? 'Upload failed.')
      onChange({ key: json.key, url: json.url })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-dashed border-border bg-muted">
          {url ? (
            <Photo src={url} alt="" sizes="96px" />
          ) : (
            <span className="grid size-full place-items-center text-muted-foreground">
              <ImagePlus className="size-6" aria-hidden />
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-background/70">
              <Loader2 className="animate-spin" aria-label="Uploading" />
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={disabled || busy}
              onClick={() => input.current?.click()}
            >
              <ImagePlus /> {url ? 'Replace' : 'Upload'}
            </Button>
            {url && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-destructive"
                disabled={disabled || busy}
                onClick={() => onChange(null)}
              >
                <Trash2 /> Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">JPG, PNG, WebP or AVIF, up to 6 MB.</p>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={(e) => {
          upload(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
