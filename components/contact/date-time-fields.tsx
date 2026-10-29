'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays, Check, ChevronDown, Clock, type LucideIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TIMES } from '@/lib/time-options'
import { cn } from '@/lib/utils'

const triggerClass =
  'mt-1 flex min-h-12 w-full min-w-0 items-center justify-between gap-3 border-b bg-transparent py-3 text-left text-base font-normal tracking-normal normal-case focus:outline-none focus-visible:border-gold-deep'

/** "2030-05-04" -> Date at local midnight, so the calendar highlights the right day in every time zone. */
const parseISO = (value: string) => {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : undefined
}

const toISO = (date: Date) => format(date, 'yyyy-MM-dd')

/**
 * Do not move focus into the popup when it opens. The popup is placed a moment after it mounts, and focusing it
 * before then makes the browser scroll the page to the top-left corner (the "jumps to top" bug).
 */
const keepScroll = { initialFocus: false as const }

type FieldBase = {
  id: string
  name: string
  invalid?: boolean
  describedBy?: string
}

type DatePickerFieldProps = FieldBase & {
  value: string
  onChange: (value: string) => void
  /** Earliest selectable day (YYYY-MM-DD). Earlier days are disabled. */
  min: string
}

/** Calendar popover. A hidden input carries the value so the surrounding form stays a normal <form>. */
export function DatePickerField({
  id,
  name,
  value,
  onChange,
  min,
  invalid,
  describedBy,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseISO(value) : undefined
  const minDate = parseISO(min)

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-haspopup="dialog"
          className={cn(triggerClass, invalid ? 'border-red-600' : 'border-charcoal/30')}
        >
          <span className={cn('flex items-center gap-2', !selected && 'text-charcoal/40')}>
            <CalendarDays aria-hidden className="size-4 shrink-0 text-gold-deep" />
            {selected ? format(selected, 'EEE, d MMM yyyy') : 'Choose a date'}
          </span>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-charcoal/50" />
        </PopoverTrigger>
        <PopoverContent aria-label="Choose event date" {...keepScroll}>
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected ?? minDate}
            disabled={minDate ? { before: minDate } : undefined}
            onSelect={(date) => {
              if (!date) return
              onChange(toISO(date))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}

export type SelectOption = { value: string; label: string }

type SelectFieldProps = FieldBase & {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder: string
  label: string
  icon?: LucideIcon
  className?: string
}

/** Styled dropdown (replaces the browser's native select) with the same look as the date picker. */
export function SelectField({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  label,
  icon: Icon,
  invalid,
  describedBy,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.value === value)

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-haspopup="listbox"
          className={cn(triggerClass, invalid ? 'border-red-600' : 'border-charcoal/30')}
        >
          <span className={cn('flex min-w-0 items-center gap-2', !current?.value && 'text-charcoal/40')}>
            {Icon && <Icon aria-hidden className="size-4 shrink-0 text-gold-deep" />}
            <span className="truncate">{current?.label || placeholder}</span>
          </span>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-charcoal/50" />
        </PopoverTrigger>
        <PopoverContent
          className={cn('max-h-72 w-[var(--anchor-width)] min-w-52 p-1', className)}
          aria-label={label}
          {...keepScroll}
        >
          <ul role="listbox" aria-label={label}>
            {options.map((option) => {
              const active = option.value === value
              return (
                <li key={option.value || 'none'} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex min-h-10 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-sm transition-colors hover:bg-gold/25',
                      active && 'bg-obsidian text-champagne hover:bg-obsidian',
                    )}
                  >
                    {option.label}
                    {active && <Check aria-hidden className="size-4 shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </>
  )
}

const TIME_OPTIONS: SelectOption[] = [{ value: '', label: 'Not sure yet' }, ...TIMES]

/** Dropdown of start times. Optional: "Not sure yet" leaves it empty. */
export function TimeSelectField(props: Omit<SelectFieldProps, 'options' | 'placeholder' | 'label' | 'icon'>) {
  return (
    <SelectField
      {...props}
      options={TIME_OPTIONS}
      placeholder="Select a start time"
      label="Start time"
      icon={Clock}
    />
  )
}
