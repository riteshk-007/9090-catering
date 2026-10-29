import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { type EnquiryInput, validateEnquiry } from '@/lib/enquiry-schema'
import { notifyAdmin } from '@/lib/mail'
import { clientIp, hashIp, rateLimit } from '@/lib/server-utils'

export const runtime = 'nodejs'

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '')
const MIN_FILL_MS = 3000 // humans need longer than this to fill the form
const MAX_FORM_AGE_MS = 24 * 3600_000
const MAX_BODY_BYTES = 10_000

const ok = () => NextResponse.json({ ok: true })

export async function POST(req: Request) {
  // 1. Only accept same-site browser posts.
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 403 })
  }

  // 2. Cheap size cap before parsing.
  const raw = await req.text()
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ error: 'Request too large.' }, { status: 413 })

  const ip = await clientIp()
  const ipHash = hashIp(ip)
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // 3. Honeypot + time trap: bots fill hidden fields and submit instantly. Pretend success so they move on.
  const age = Date.now() - Number(body.t)
  if (str(body.website, 100) || !Number.isFinite(age) || age < MIN_FILL_MS || age > MAX_FORM_AGE_MS)
    return ok()

  const input: EnquiryInput = {
    name: str(body.name, 200),
    phone: str(body.phone, 50),
    email: str(body.email, 300),
    type: str(body.type, 100),
    date: str(body.date, 20),
    time: str(body.time, 5),
    guests: str(body.guests, 10),
    location: str(body.location, 300),
    notes: str(body.notes, 2100),
  }
  const errors = validateEnquiry(input)
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 })

  // 4. Link spam: genuine enquiries rarely contain links.
  const links = `${input.name} ${input.location} ${input.notes}`.match(/https?:\/\/|www\./gi)?.length ?? 0
  if (links > 1) return ok()

  try {
    const email = input.email.trim().toLowerCase()
    const hourAgo = new Date(Date.now() - 3600_000)

    // 5. Persistent per-IP cap (survives restarts) and duplicate-submit guard.
    const [fromIp, duplicate] = await Promise.all([
      db.enquiry.count({ where: { ipHash, createdAt: { gt: hourAgo } } }),
      db.enquiry.findFirst({
        where: { email, createdAt: { gt: new Date(Date.now() - 10 * 60_000) } },
        select: { id: true },
      }),
    ])
    if (fromIp >= 10) {
      return NextResponse.json(
        { error: 'Too many enquiries from this connection. Please try again later.' },
        { status: 429 },
      )
    }
    if (duplicate) return ok() // double click / resend: already stored

    const saved = await db.enquiry.create({
      data: {
        name: input.name.trim(),
        phone: input.phone.trim(),
        email,
        eventType: input.type,
        eventDate: new Date(`${input.date}T00:00:00.000Z`),
        eventTime: input.time || null,
        guests: Number(input.guests),
        location: input.location.trim(),
        notes: input.notes?.trim() || null,
        ipHash,
      },
    })

    const adminUrl = host
      ? `${host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'}://${host}/admin/enquiries/${saved.id}`
      : undefined
    const sent = await notifyAdmin({ ...saved, eventDate: input.date, eventTime: saved.eventTime, adminUrl })
    if (sent) await db.enquiry.update({ where: { id: saved.id }, data: { notified: true } })

    return ok()
  } catch (err) {
    console.error('Enquiry save failed', err)
    return NextResponse.json(
      { error: 'We could not save your enquiry. Please try again shortly.' },
      { status: 500 },
    )
  }
}
