'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Globe } from 'lucide-react'
import { LANGUAGES, chooseLanguage, currentLanguage } from '@/lib/translate'
import { cn } from '@/lib/utils'

type LanguageSwitcherProps = {
  /** "menu": small dropdown for the top bar. "list": every language as a button, for the phone menu. */
  variant?: 'menu' | 'list'
}

/** The wrappers are marked notranslate so the language names themselves are never translated. */
export function LanguageSwitcher({ variant = 'menu' }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => setLanguage(currentLanguage()), [])

  useEffect(() => {
    if (!open) return
    const onMouse = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (code: string) => {
    setOpen(false)
    if (code !== language) chooseLanguage(code)
  }

  if (variant === 'list') {
    return (
      <div className="notranslate" translate="no">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
          <Globe aria-hidden className="size-4" strokeWidth={1.5} /> Language
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => pick(item.code)}
              aria-pressed={language === item.code}
              className={cn(
                'min-h-10 border px-3 text-xs transition-colors',
                language === item.code
                  ? 'border-gold bg-gold text-obsidian'
                  : 'border-gold/35 text-ivory/85 hover:border-gold',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={box} className="notranslate relative" translate="no">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className="flex min-h-11 items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] whitespace-nowrap text-ivory/80 uppercase transition-colors hover:text-gold"
      >
        <Globe aria-hidden className="size-4" strokeWidth={1.5} />
        {language.split('-')[0]}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute top-full right-0 z-10 max-h-[70svh] w-44 overflow-y-auto border border-gold/25 bg-obsidian py-2 shadow-xl"
        >
          {LANGUAGES.map((item) => (
            <li key={item.code} role="option" aria-selected={language === item.code}>
              <button
                type="button"
                onClick={() => pick(item.code)}
                className="flex min-h-10 w-full items-center justify-between px-4 text-left text-sm text-ivory/90 transition-colors hover:bg-gold/15 hover:text-gold"
              >
                {item.label}
                {language === item.code && <Check aria-hidden className="size-3.5 text-gold" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
