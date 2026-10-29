import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'
import { StatusBadge, statusLabel } from '../status'
import type { EnquiryStatus } from '@/lib/generated/prisma/client'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20
const statuses: EnquiryStatus[] = ['NEW', 'CONTACTED', 'CLOSED']

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>
}) {
  await requireAdmin()
  const sp = await searchParams
  const status = statuses.find((s) => s === sp.status)
  const q = (sp.q ?? '').trim().slice(0, 100)
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1)

  const where = {
    ...(status && { status }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
        { phone: { contains: q } },
        { location: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [rows, total, counts] = await Promise.all([
    db.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.enquiry.count({ where }),
    db.enquiry.groupBy({ by: ['status'], _count: true }),
  ])
  const count = (s: EnquiryStatus) => counts.find((c) => c.status === s)?._count ?? 0
  const all = counts.reduce((n, c) => n + c._count, 0)
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const href = (p: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { status: status ?? undefined, q: q || undefined, ...p }
    Object.entries(merged).forEach(([k, v]) => v && params.set(k, v))
    const s = params.toString()
    return s ? `/admin/enquiries?${s}` : '/admin/enquiries'
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-4xl">Enquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Catering requests submitted through the website contact form.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ['All', all],
          ['New', count('NEW')],
          ['Contacted', count('CONTACTED')],
          ['Closed', count('CLOSED')],
        ].map(([label, n]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl text-primary">{n}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href={href({ status: undefined, page: undefined })}
              className={buttonVariants({ variant: !status ? 'default' : 'outline', size: 'sm' })}
            >
              All
            </Link>
            {statuses.map((s) => (
              <Link
                key={s}
                href={href({ status: s, page: undefined })}
                className={buttonVariants({ variant: status === s ? 'default' : 'outline', size: 'sm' })}
              >
                {statusLabel[s]}
              </Link>
            ))}
          </div>
          <form action="/admin/enquiries" className="flex gap-2">
            {status && <input type="hidden" name="status" value={status} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, phone, location"
              aria-label="Search enquiries"
              className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button type="submit" className={buttonVariants({ variant: 'secondary' })}>
              Search
            </button>
          </form>
        </CardHeader>
        <CardContent className="px-0">
          {rows.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">No enquiries found.</p>
          ) : (
            <>
              <ul className="divide-y divide-border md:hidden">
                {rows.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/admin/enquiries/${r.id}`}
                      className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-muted active:bg-muted"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 font-medium break-words">{r.name}</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.email}</p>
                        <p className="mt-2 text-sm">{r.eventType}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.eventDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })}{' '}
                          · {r.guests} guests
                        </p>
                      </div>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Received</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-4 text-right">
                        <span className="sr-only">Open</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="pl-4 whitespace-nowrap text-muted-foreground">
                          {r.createdAt.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{r.name}</p>
                          <p className="max-w-[14rem] truncate text-xs text-muted-foreground">{r.email}</p>
                        </TableCell>
                        <TableCell>{r.eventType}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {r.eventDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{r.guests}</TableCell>
                        <TableCell>
                          <StatusBadge status={r.status} />
                        </TableCell>
                        <TableCell className="pr-4 text-right">
                          <Link
                            href={`/admin/enquiries/${r.id}`}
                            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                          >
                            View <ArrowRight />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={href({ page: String(page - 1) })}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Previous
              </Link>
            )}
            {page < pages && (
              <Link
                href={href({ page: String(page + 1) })}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
