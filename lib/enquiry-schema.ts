/** Shared (client + server) validation for the enquiry form. */
export const EVENT_TYPES = [
  'Wedding / celebration',
  'Corporate event',
  'Private dinner or gathering',
  'Other',
] as const

export type EnquiryInput = {
  name: string
  phone: string
  email: string
  type: string
  date: string
  /** Optional start time "HH:MM" */
  time?: string
  guests: string
  location: string
  notes?: string
}

export type EnquiryErrors = Partial<
  Record<'name' | 'phone' | 'email' | 'type' | 'date' | 'time' | 'guests' | 'location' | 'notes', string>
>

export const todayISO = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function validateEnquiry(v: EnquiryInput): EnquiryErrors {
  const e: EnquiryErrors = {}
  const name = v.name?.trim() ?? ''
  if (!name) e.name = 'Please enter your full name.'
  else if (name.length > 100) e.name = 'Name is too long.'
  const phone = v.phone?.trim() ?? ''
  if (!phone) e.phone = 'Please enter a phone number.'
  else if (!/^\+?[0-9\s().-]{7,18}$/.test(phone)) e.phone = 'Enter a valid phone number.'
  const email = v.email?.trim() ?? ''
  if (!email) e.email = 'Please enter your email address.'
  else if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    e.email = 'Enter a valid email address.'
  if (!v.type) e.type = 'Please choose an event type.'
  else if (!(EVENT_TYPES as readonly string[]).includes(v.type))
    e.type = 'Choose one of the listed event types.'
  if (!v.date) e.date = 'Please choose an event date.'
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date) || Number.isNaN(Date.parse(v.date)))
    e.date = 'Enter a valid date.'
  else if (v.date < todayISO()) e.date = 'Event date cannot be in the past.'
  if (v.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)) e.time = 'Choose a valid time.'
  const guests = Number(v.guests)
  if (!v.guests) e.guests = 'Please enter the number of guests.'
  else if (!Number.isInteger(guests) || guests < 1 || guests > 100000)
    e.guests = 'Enter a whole number of guests (1 or more).'
  const location = v.location?.trim() ?? ''
  if (!location) e.location = 'Please enter the event location.'
  else if (location.length > 200) e.location = 'Location is too long.'
  if ((v.notes?.length ?? 0) > 2000) e.notes = 'Please keep this under 2000 characters.'
  return e
}
