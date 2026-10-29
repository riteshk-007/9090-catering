'use client'

import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DatePickerField, SelectField, TimeSelectField } from './date-time-fields'
import { EVENT_TYPES, type EnquiryErrors, todayISO, validateEnquiry } from '@/lib/enquiry-schema'

const fields = ['name', 'phone', 'email', 'type', 'date', 'guests', 'location'] as const
type Field = (typeof fields)[number]
type Status = 'idle' | 'loading' | 'success' | 'error'

const input =
  'mt-1 block w-full min-w-0 border-b bg-transparent py-3 text-base font-normal normal-case tracking-normal text-charcoal placeholder:text-charcoal/40 focus:outline-none focus-visible:border-gold-deep'
const label = 'block min-w-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/60'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [serverError, setServerError] = useState('')
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const openedAt = useRef(Date.now()) // anti-spam: server rejects instant submissions

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const data = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>
    const found = validateEnquiry({
      name: data.name ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      type: data.type ?? '',
      date: data.date ?? '',
      time: data.time ?? '',
      guests: data.guests ?? '',
      location: data.location ?? '',
      notes: data.notes ?? '',
    })
    setErrors(found)
    setServerError('')
    if (Object.keys(found).length) {
      setStatus('error')
      const first = fields.find((f) => found[f])
      requestAnimationFrame(() => (document.getElementById(`f-${first}`) as HTMLElement | null)?.focus())
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, t: openedAt.current }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
        return
      }
      if (json.errors) setErrors(json.errors)
      setServerError(json.error ?? 'Something went wrong. Please check the form and try again.')
      setStatus('error')
    } catch {
      setServerError('Network problem. Please check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border-l border-gold pl-6">
        <h3 className="font-serif text-3xl text-charcoal sm:text-4xl">
          Thank you. Your enquiry has been received.
        </h3>
        <p className="mt-4 max-w-lg text-[15px] leading-7 text-charcoal/70">
          We have your details and will review them. This is not a booking confirmation; we will contact you
          using the phone number or email you provided.
        </p>
        <button
          type="button"
          onClick={() => {
            setType('')
            setDate('')
            setTime('')
            setErrors({})
            setStatus('idle')
          }}
          className="mt-6 min-h-11 border-b border-gold-deep/60 text-[11px] font-semibold tracking-[0.22em] text-gold-deep uppercase"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  const err = (f: Field) => errors[f]
  const common = (f: Field) => ({
    id: `f-${f}`,
    name: f,
    'aria-invalid': !!err(f) || undefined,
    'aria-describedby': err(f) ? `e-${f}` : undefined,
    className: cn(input, err(f) ? 'border-red-600' : 'border-charcoal/30'),
  })
  const msg = (f: Field) =>
    err(f) && (
      <span id={`e-${f}`} className="mt-1 block text-xs tracking-normal text-red-700 normal-case">
        {err(f)}
      </span>
    )

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      {status === 'error' && (
        <p
          role="alert"
          className="border border-red-600/50 bg-red-600/10 px-4 py-3 text-sm text-red-800 sm:col-span-2"
        >
          {serverError || 'Please correct the highlighted fields and try again.'}
        </p>
      )}
      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className={label}>
        Full name *
        <input {...common('name')} autoComplete="name" required maxLength={100} placeholder="Your name" />
        {msg('name')}
      </label>
      <label className={label}>
        Phone number *
        <input
          {...common('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="+00 000 000 0000"
        />
        {msg('phone')}
      </label>
      <label className={cn(label, 'sm:col-span-2')}>
        Email address *
        <input
          {...common('email')}
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
        {msg('email')}
      </label>
      <div className={label}>
        <label htmlFor="f-type">Event type *</label>
        <SelectField
          id="f-type"
          name="type"
          value={type}
          onChange={setType}
          options={EVENT_TYPES.map((t) => ({ value: t, label: t }))}
          placeholder="Select an event type"
          label="Event type"
          invalid={!!err('type')}
          describedBy={err('type') ? 'e-type' : undefined}
        />
        {msg('type')}
      </div>
      <label className={label}>
        Number of guests *
        <input
          {...common('guests')}
          type="number"
          inputMode="numeric"
          min={1}
          required
          placeholder="Approximate number"
        />
        {msg('guests')}
      </label>
      <div className={label}>
        <label htmlFor="f-date">Event date *</label>
        <DatePickerField
          id="f-date"
          name="date"
          value={date}
          onChange={setDate}
          min={todayISO()}
          invalid={!!err('date')}
          describedBy={err('date') ? 'e-date' : undefined}
        />
        {msg('date')}
      </div>
      <div className={label}>
        <label htmlFor="f-time">Start time (optional)</label>
        <TimeSelectField id="f-time" name="time" value={time} onChange={setTime} />
      </div>
      <label className={cn(label, 'sm:col-span-2')}>
        Event location *
        <input
          {...common('location')}
          autoComplete="off"
          required
          maxLength={200}
          placeholder="Venue or area"
        />
        {msg('location')}
      </label>
      <label className={cn(label, 'sm:col-span-2')}>
        Additional requirements
        <textarea
          name="notes"
          rows={4}
          maxLength={2000}
          placeholder="Dietary needs, style, anything else we should know"
          className={cn(input, 'resize-none border-charcoal/30')}
        />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-[11px] font-bold tracking-[0.22em] text-obsidian uppercase transition-colors duration-300 hover:bg-champagne disabled:opacity-70 sm:w-auto"
        >
          {status === 'loading' && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {status === 'loading' ? 'Sending…' : 'Submit enquiry ↗'}
        </button>
        <p className="mt-4 text-xs leading-5 text-charcoal/60">
          * Required. Submitting is an enquiry only; it does not confirm a booking.
        </p>
      </div>
    </form>
  )
}
