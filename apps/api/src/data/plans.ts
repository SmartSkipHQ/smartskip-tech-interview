import type { Plan } from '@smartskip/shared'

/** ISO day, `days` days from today. */
function inDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const now = new Date().toISOString()

export const seedPlans: Plan[] = [
  {
    id: 'plan_01',
    title: 'Backyard barbecue',
    city: 'Phoenix, AZ',
    date: inDays(2),
    notes: 'Twelve people, nowhere to move it indoors.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'plan_02',
    title: 'Moving apartments',
    city: 'Denver, CO',
    date: inDays(3),
    notes: 'Rented van, booked for the whole day.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'plan_03',
    title: '10k training run',
    city: 'Seattle, WA',
    date: inDays(1),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'plan_04',
    title: 'Client meeting downtown',
    city: 'Chicago, IL',
    date: inDays(4),
    notes: 'Their office, 14th floor.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'plan_05',
    title: 'Beach day',
    city: 'Miami, FL',
    date: inDays(5),
    createdAt: now,
    updatedAt: now,
  },
]
