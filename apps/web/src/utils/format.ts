/** "3 days ago", "5 months ago" — precise enough for a case file. */
export function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)

  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 45) return `${days} days ago`

  const months = Math.round(days / 30)
  if (months < 24) return `${months} months ago`

  const years = Math.round(days / 365)
  return years === 1 ? 'a year ago' : `${years} years ago`
}
