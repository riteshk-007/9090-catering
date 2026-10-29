import { Badge } from '@/components/ui/badge'
import type { EnquiryStatus } from '@/lib/generated/prisma/client'

export const statusLabel: Record<EnquiryStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  CLOSED: 'Closed',
}

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <Badge variant={status === 'NEW' ? 'default' : status === 'CONTACTED' ? 'secondary' : 'outline'}>
      {statusLabel[status]}
    </Badge>
  )
}
