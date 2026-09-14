import { describe, expect, it } from 'vitest'
import type { SearchSubject } from '@smartskip/shared'
import { SubjectStore } from './subjectStore'

const webb: SearchSubject = {
  id: 'sub_01',
  reference: 'SK-2041',
  fullName: 'Marcus Webb',
  knownPhone: '+1 602 555 0147',
  lastKnownAddress: {
    line1: '1140 N 3rd St',
    city: 'Phoenix',
    state: 'AZ',
    postalCode: '85004',
  },
  status: 'searching',
  openedAt: '2026-09-08T00:00:00.000Z',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
}

const price: SearchSubject = {
  ...webb,
  id: 'sub_03',
  reference: 'SK-2039',
  fullName: 'Darnell Price',
  status: 'resolved',
  openedAt: '2026-08-24T00:00:00.000Z',
}

describe('SubjectStore', () => {
  it('lists the most recently opened case first', () => {
    const store = new SubjectStore([price, webb])

    expect(store.list().map((subject) => subject.id)).toEqual(['sub_01', 'sub_03'])
  })

  it('filters by status', () => {
    const store = new SubjectStore([webb, price])

    expect(store.list({ status: 'resolved' })).toHaveLength(1)
  })

  it('does not leak the caller a reference to its own seed data', () => {
    const seed = structuredClone(webb)
    const store = new SubjectStore([seed])

    seed.fullName = 'mutated'

    expect(store.find('sub_01')?.fullName).toBe('Marcus Webb')
  })
})

/**
 * TODO(candidate): the create / update / delete paths have no tests yet.
 * Add the ones you would want a teammate to have written.
 */
