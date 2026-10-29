'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'

type CalendarProps = React.ComponentProps<typeof DayPicker>

/** shadcn-style calendar on react-day-picker, themed for the ivory/gold site palette. */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-1', className)}
      classNames={{
        root: 'w-fit',
        months: 'relative flex flex-col gap-4',
        month: 'flex flex-col gap-3',
        month_caption: 'flex h-10 items-center justify-center px-10',
        caption_label: 'font-serif text-xl',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous:
          'grid size-10 place-items-center rounded-md text-charcoal/70 transition-colors hover:bg-charcoal/10 disabled:opacity-30',
        button_next:
          'grid size-10 place-items-center rounded-md text-charcoal/70 transition-colors hover:bg-charcoal/10 disabled:opacity-30',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-10 pb-1 text-center text-[11px] font-semibold tracking-wider text-charcoal/50 uppercase',
        week: 'mt-1 flex',
        day: 'size-10 p-0 text-center text-sm',
        day_button:
          'grid size-10 place-items-center rounded-md transition-colors hover:bg-gold/25 focus-visible:outline-2 focus-visible:outline-gold-deep',
        selected: '[&>button]:bg-obsidian [&>button]:font-semibold [&>button]:text-champagne [&>button]:hover:bg-obsidian',
        today: '[&>button]:ring-1 [&>button]:ring-gold-deep',
        outside: 'text-charcoal/30',
        disabled: 'text-charcoal/25 [&>button]:pointer-events-none [&>button]:cursor-not-allowed',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />,
      }}
      {...props}
    />
  )
}

export { Calendar }
