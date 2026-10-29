import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { timeLabel } from '@/lib/time-options'
import { db } from '@/lib/db'
import type { EnquiryStatus } from '@/lib/generated/prisma/client'
import { setStatus } from '../../../actions'
import { DeleteEnquiryButton } from './delete-button'
import { StatusBadge, statusLabel } from '../../status'

export const dynamic = 'force-dynamic'

const statuses: EnquiryStatus[] = ['NEW', 'CONTACTED', 'CLOSED']

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const e = await db.enquiry.findUnique({ where: { id } })
  if (!e) notFound()

  const details: [string, React.ReactNode][] = [
    ['Event type', e.eventType],
    ['Event date', e.eventDate.toLocaleDateString('en-GB', { dateStyle: 'full', timeZone: 'UTC' })],
    ['Start time', e.eventTime ? timeLabel(e.eventTime) : 'Not specified'],
    ['Guests', e.guests],
    ['Location', e.location],
    ['Received', e.createdAt.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })],
    ['Admin email', e.notified ? 'Sent' : 'Not sent (check Brevo settings)'],
  ]

  return (
    <div className="grid gap-6">
      <Link href="/admin/enquiries" className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} w-fit`}>
        <ArrowLeft /> All enquiries
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-4xl">{e.name}</h1>
        <StatusBadge status={e.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Enquiry details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              {details.map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-xs tracking-widest text-muted-foreground uppercase">{k}</dt>
                  <dd className="mt-1 text-base [overflow-wrap:anywhere]">{v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                Additional requirements
              </p>
              <p className="mt-1 text-base [overflow-wrap:anywhere] whitespace-pre-wrap">{e.notes || '—'}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <a
                href={`mailto:${e.email}`}
                className={`${buttonVariants({ variant: 'outline' })} h-9 justify-start`}
              >
                <Mail /> <span className="truncate">{e.email}</span>
              </a>
              <a
                href={`tel:${e.phone.replace(/[^+\d]/g, '')}`}
                className={`${buttonVariants({ variant: 'outline' })} h-9 justify-start`}
              >
                <Phone /> {e.phone}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <form key={s} action={setStatus.bind(null, e.id, s)}>
                  <Button
                    type="submit"
                    size="sm"
                    variant={e.status === s ? 'default' : 'outline'}
                    aria-pressed={e.status === s}
                  >
                    {statusLabel[s]}
                  </Button>
                </form>
              ))}
            </CardContent>
          </Card>

          <DeleteEnquiryButton id={e.id} />
        </div>
      </div>
    </div>
  )
}
