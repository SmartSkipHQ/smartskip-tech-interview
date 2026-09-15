import { describe, expect, it } from 'vitest'
import type { Plan } from '@smartskip/shared'
import { fixtureProvider } from './fixture'

function inDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const plan = (city: string, date: string): Plan => ({
  id: 'plan_test',
  title: 'Something outdoors',
  city,
  date,
  createdAt: '2026-09-14T00:00:00.000Z',
  updatedAt: '2026-09-14T00:00:00.000Z',
})

describe('fixtureProvider', () => {
  it('returns a forecast for a known city inside the window', async () => {
    const result = await fixtureProvider.forecastFor(plan('Phoenix, AZ', inDays(2)))

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.forecast.resolvedLocation).toBe('Phoenix, Arizona, US')
    expect(result.forecast.highC).toBeGreaterThan(35)
  })

  it('reports a city it cannot place', async () => {
    const result = await fixtureProvider.forecastFor(plan('Lakeview East', inDays(3)))

    expect(result.ok).toBe(false)
    if (result.ok) return

    expect(result.reason).toBe('city_not_found')
  })

  it('reports a date beyond the forecast window', async () => {
    const result = await fixtureProvider.forecastFor(plan('Boston, MA', inDays(40)))

    expect(result.ok).toBe(false)
    if (result.ok) return

    expect(result.reason).toBe('out_of_range')
  })
})
