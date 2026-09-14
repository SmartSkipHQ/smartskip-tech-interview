import { describe, expect, it } from 'vitest'
import type { Plan } from '@smartskip/shared'
import { PlanStore } from './planStore'

const barbecue: Plan = {
  id: 'plan_01',
  title: 'Backyard barbecue',
  city: 'Phoenix, AZ',
  date: '2026-09-19',
  notes: 'Twelve people, nowhere to move it indoors.',
  createdAt: '2026-09-14T00:00:00.000Z',
  updatedAt: '2026-09-14T00:00:00.000Z',
}

const run: Plan = {
  ...barbecue,
  id: 'plan_03',
  title: '10k training run',
  city: 'Seattle, WA',
  date: '2026-09-16',
}

describe('PlanStore', () => {
  it('lists the soonest plan first', () => {
    const store = new PlanStore([barbecue, run])

    expect(store.list().map((plan) => plan.id)).toEqual(['plan_03', 'plan_01'])
  })

  it('finds a plan by id', () => {
    const store = new PlanStore([barbecue, run])

    expect(store.find('plan_01')?.title).toBe('Backyard barbecue')
    expect(store.find('nope')).toBeUndefined()
  })

  it('does not leak the caller a reference to its own seed data', () => {
    const seed = structuredClone(barbecue)
    const store = new PlanStore([seed])

    seed.title = 'mutated'

    expect(store.find('plan_01')?.title).toBe('Backyard barbecue')
  })
})

/**
 * TODO(candidate): the create / update / delete paths have no tests yet.
 * Add the ones you would want a teammate to have written.
 */
