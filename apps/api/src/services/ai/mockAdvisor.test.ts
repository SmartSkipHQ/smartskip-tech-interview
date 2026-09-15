import { describe, expect, it } from 'vitest'
import type { Forecast, Plan } from '@smartskip/shared'
import { mockAdvisor } from './mockAdvisor'

const plan: Plan = {
  id: 'plan_04',
  title: 'Client meeting downtown',
  city: 'Chicago, IL',
  date: '2026-09-18',
  notes: 'Their office, 14th floor.',
  createdAt: '2026-09-14T00:00:00.000Z',
  updatedAt: '2026-09-14T00:00:00.000Z',
}

const forecast: Forecast = {
  resolvedLocation: 'Chicago, Illinois, US',
  date: '2026-09-18',
  highC: 17,
  lowC: 11,
  precipitationMm: 6.5,
  chanceOfRainPct: 75,
  windKph: 25,
  summary: 'Rain',
}

describe('mockAdvisor', () => {
  it('moves anything with real rain on it, indoors or not', async () => {
    const advice = await mockAdvisor.advise({ plan, forecast })

    // Documents the gap rather than endorsing it: this meeting is on the
    // fourteenth floor and the rain is irrelevant.
    expect(advice.verdict).toBe('reschedule')
  })

  it('has nothing to say about heat', async () => {
    const advice = await mockAdvisor.advise({
      plan: { ...plan, title: 'Backyard barbecue', city: 'Phoenix, AZ' },
      forecast: { ...forecast, highC: 41, precipitationMm: 0, chanceOfRainPct: 0 },
    })

    expect(advice.verdict).toBe('go')
  })
})
