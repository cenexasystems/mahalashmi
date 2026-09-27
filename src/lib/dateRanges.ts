/**
 * Shared date ranges for every "Today / This Week / This Month / This Year" filter.
 *   Week  = Monday to Saturday of the current week (the shop's working week)
 *   Month = 1st to the last day of the month (28/29/30/31)
 *   Year  = 1 January to 31 December
 * All dates are local (IST), never UTC, so "today" is right after midnight too.
 */
export type RangePreset = 'today' | 'week' | 'month' | 'year'

/** YYYY-MM-DD in local time (toISOString() would give the UTC date). */
export const toLocalDateStr = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Monday of the week containing `d` (Sunday belongs to the week that started the previous Monday). */
export const startOfWeekMonday = (d: Date): Date => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return x
}

/** First and last day (inclusive) of the preset, as local Date objects at midnight. */
export const getPresetDates = (preset: RangePreset, now: Date = new Date()): { from: Date; to: Date } => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (preset === 'today') return { from: today, to: today }
  if (preset === 'week') {
    const from = startOfWeekMonday(today)
    const to = new Date(from); to.setDate(from.getDate() + 5) // Saturday
    return { from, to }
  }
  if (preset === 'month') {
    return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: new Date(today.getFullYear(), today.getMonth() + 1, 0) }
  }
  return { from: new Date(today.getFullYear(), 0, 1), to: new Date(today.getFullYear(), 11, 31) }
}

/** The preset as YYYY-MM-DD strings, for date inputs and queries. */
export const getPresetRange = (preset: RangePreset, now: Date = new Date()): { from: string; to: string } => {
  const { from, to } = getPresetDates(preset, now)
  return { from: toLocalDateStr(from), to: toLocalDateStr(to) }
}

/** Whether a timestamp/date falls inside the preset (inclusive of the whole last day). */
export const isInPreset = (value: string | Date | null | undefined, preset: RangePreset, now: Date = new Date()): boolean => {
  if (!value) return false
  const d = value instanceof Date ? value : new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value)
  if (isNaN(d.getTime())) return false
  const { from, to } = getPresetDates(preset, now)
  const end = new Date(to); end.setDate(to.getDate() + 1)
  return d >= from && d < end
}
