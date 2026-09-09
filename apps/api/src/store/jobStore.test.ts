import { describe, expect, it } from 'vitest'
import type { Job } from '@smartskip/shared'
import { JobStore } from './jobStore'

const baseJob: Job = {
  id: 'job_01',
  reference: 'SS-1041',
  customerName: 'Ashworth Builders',
  address: '18 Deansgate, Manchester M3 2AY',
  location: { lat: 53.4794, lon: -2.2496 },
  scheduledFor: '2026-09-10T08:00:00.000Z',
  type: 'delivery',
  status: 'scheduled',
  skipSize: 8,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
}

const laterJob: Job = {
  ...baseJob,
  id: 'job_02',
  reference: 'SS-1042',
  scheduledFor: '2026-09-10T15:00:00.000Z',
  status: 'completed',
}

describe('JobStore', () => {
  it('returns jobs in chronological order', () => {
    const store = new JobStore([laterJob, baseJob])

    expect(store.list().map((job) => job.id)).toEqual(['job_01', 'job_02'])
  })

  it('filters by status', () => {
    const store = new JobStore([baseJob, laterJob])

    expect(store.list({ status: 'completed' })).toHaveLength(1)
  })

  it('does not leak the caller a reference to its own seed data', () => {
    const seed = structuredClone(baseJob)
    const store = new JobStore([seed])

    seed.customerName = 'mutated'

    expect(store.find('job_01')?.customerName).toBe('Ashworth Builders')
  })
})

/**
 * TODO(candidate): the create / update / delete paths have no tests yet.
 * Add the ones you would want a teammate to have written.
 */
