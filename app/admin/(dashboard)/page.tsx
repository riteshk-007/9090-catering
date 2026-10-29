import Link from 'next/link'
import { ArrowRight, ImagePlus, Inbox, ListTree, Settings2, UtensilsCrossed } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'
import { StatusBadge } from './status'

export const dynamic = 'force-dynamic'

const guide = [
  {
    icon: Inbox,
    title: 'Enquiries',
    href: '/admin/enquiries',
    text: 'Messages sent through the website contact form. Open one to see every detail, change its status (New, Contacted, Closed) or delete it.',
  },
  {
    icon: ListTree,
    title: 'Categories & dishes',
    href: '/admin/menu',
    text: 'Your menu. Create categories (for example Starters), add dishes with photos and descriptions, and put them in the order you like.',
  },
  {
    icon: Settings2,
    title: 'Menu page settings',
    href: '/admin/menu/settings',
    text: 'Turn prices on or off, edit the texts on the menu page, and control the dish carousel on the home page.',
  },
  {
    icon: ImagePlus,
    title: 'Gallery',
    href: '/admin/gallery',
    text: 'Upload photos, drag them into order, edit their descriptions, or hide and delete them.',
  },
]

export default async function AdminOverviewPage() {
  await requireAdmin()

  const [newCount, totalEnquiries, dishes, published, categories, photos, recent] = await Promise.all([
    db.enquiry.count({ where: { status: 'NEW' } }),
    db.enquiry.count(),
    db.menuItem.count(),
    db.menuItem.count({ where: { published: true } }),
    db.menuCategory.count(),
    db.galleryImage.count(),
    db.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  const stats = [
    {
      label: 'New enquiries',
      value: newCount,
      hint: `${totalEnquiries} in total`,
      href: '/admin/enquiries?status=NEW',
    },
    {
      label: 'Dishes on the menu',
      value: published,
      hint: `${dishes - published} drafts, ${categories} categories`,
      href: '/admin/menu',
    },
    { label: 'Gallery photos', value: photos, hint: 'Shown on the Gallery page', href: '/admin/gallery' },
  ]

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is what is happening on your website. Use the menu on the left to manage each area.
        </p>
      </div>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card size="sm" className="h-full transition-colors group-hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold text-primary">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section aria-label="Quick actions" className="flex flex-wrap gap-3">
        <Link href="/admin/menu" className={cn(buttonVariants(), 'h-10 px-4')}>
          <UtensilsCrossed /> Add or edit dishes
        </Link>
        <Link href="/admin/gallery" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
          <ImagePlus /> Upload photos
        </Link>
        <Link href="/admin/enquiries" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
          <Inbox /> Read enquiries
        </Link>
      </section>

      <section aria-labelledby="recent-h">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-h" className="text-lg font-medium">
            Latest enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            See all <ArrowRight className="size-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No enquiries yet. They will appear here when visitors use the contact form.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {recent.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/enquiries/${r.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.eventType} ·{' '}
                      {r.eventDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}{' '}
                      · {r.guests} guests
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="guide-h">
        <h2 id="guide-h" className="mb-3 text-lg font-medium">
          What each section does
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {guide.map((g) => (
            <Link key={g.href} href={g.href} className="group">
              <Card className="h-full transition-colors group-hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <g.icon aria-hidden className="size-5 text-primary" /> {g.title}
                  </CardTitle>
                  <CardDescription className="leading-6">{g.text}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
