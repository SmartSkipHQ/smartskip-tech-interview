/** Parse an ISO day ("2026-09-19") as a local date, not a UTC instant. */
function parseDay(isoDay: string): Date {
  const [year, month, day] = isoDay.split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

/** "Today", "Tomorrow", "Saturday", or "Sep 19" once it is far enough out. */
export function dayLabel(isoDay: string): string {
  const target = parseDay(isoDay)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days > 1 && days < 7) return target.toLocaleDateString([], { weekday: 'long' })

  return target.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
