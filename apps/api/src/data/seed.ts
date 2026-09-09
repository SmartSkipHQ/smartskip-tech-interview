import type { Job } from '@smartskip/shared'

/** Slot on `dayOffset` days from today at `hour` local time, as an ISO string. */
function slot(dayOffset: number, hour: number): string {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

const now = new Date().toISOString()

/**
 * Seed data for a single depot in Manchester. Coordinates are real so that the
 * weather and routing providers return sensible answers.
 */
export const seedJobs: Job[] = [
  {
    id: 'job_01',
    reference: 'SS-1041',
    customerName: 'Ashworth Builders',
    address: '18 Deansgate, Manchester M3 2AY',
    location: { lat: 53.4794, lon: -2.2496 },
    scheduledFor: slot(0, 8),
    type: 'delivery',
    status: 'scheduled',
    skipSize: 8,
    notes: 'Permit already in place, drop on the driveway.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'job_02',
    reference: 'SS-1042',
    customerName: 'Hulme Community Centre',
    address: '77 Stretford Road, Manchester M15 6HE',
    location: { lat: 53.4652, lon: -2.2549 },
    scheduledFor: slot(0, 10),
    type: 'collection',
    status: 'scheduled',
    skipSize: 6,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'job_03',
    reference: 'SS-1043',
    customerName: 'Nadia Rahman',
    address: '4 Ladybarn Lane, Manchester M14 6WQ',
    location: { lat: 53.4362, lon: -2.2166 },
    scheduledFor: slot(0, 13),
    type: 'exchange',
    status: 'in_progress',
    skipSize: 4,
    notes: 'Narrow street, small lorry only.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'job_04',
    reference: 'SS-1044',
    customerName: 'Salford Quays Fit-Out Ltd',
    address: 'The Quays, Salford M50 3AZ',
    location: { lat: 53.4711, lon: -2.2892 },
    scheduledFor: slot(1, 9),
    type: 'delivery',
    status: 'scheduled',
    skipSize: 12,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'job_05',
    reference: 'SS-1045',
    customerName: 'Prestwich Roofing',
    address: '210 Bury New Road, Prestwich M25 1AY',
    location: { lat: 53.5327, lon: -2.2812 },
    scheduledFor: slot(1, 14),
    type: 'collection',
    status: 'scheduled',
    skipSize: 16,
    notes: 'Roof strip, expect heavy load.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'job_06',
    reference: 'SS-1039',
    customerName: 'Chorlton Kitchens',
    address: '9 Barlow Moor Road, Manchester M21 8BQ',
    location: { lat: 53.4426, lon: -2.2799 },
    scheduledFor: slot(-1, 11),
    type: 'collection',
    status: 'completed',
    skipSize: 6,
    createdAt: now,
    updatedAt: now,
  },
]
