/** Half-hourly start times from 06:00 to 23:30, as "HH:MM" values with friendly 12-hour labels. */
export const TIMES = Array.from({ length: 36 }, (_, i) => {
  const minutes = 6 * 60 + i * 30
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const label = `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
  return { value, label }
})

export const timeLabel = (value: string) => TIMES.find((t) => t.value === value)?.label ?? value
