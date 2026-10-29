'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteEnquiry } from '../../../actions'

/** Two-step delete so an enquiry cannot be removed by one accidental click. */
export function DeleteEnquiryButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false)
  const [pending, start] = useTransition()

  if (!confirm) {
    return (
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={() => setConfirm(true)}
      >
        <Trash2 /> Delete enquiry
      </Button>
    )
  }

  return (
    <div className="grid gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
      <p className="text-sm text-destructive">Delete this enquiry permanently?</p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={() => start(() => deleteEnquiry(id))}
        >
          {pending && <Loader2 className="animate-spin" />} Yes, delete
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => setConfirm(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
