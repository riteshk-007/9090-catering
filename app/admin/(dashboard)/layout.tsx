import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const newEnquiries = await db.enquiry.count({ where: { status: 'NEW' } })
  return <AdminShell newEnquiries={newEnquiries}>{children}</AdminShell>
}
