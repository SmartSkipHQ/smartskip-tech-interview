import type { Forecast, Plan } from '@smartskip/shared'
import type { ForecastResult, WeatherProvider } from './types'

/** Matches what Open-Meteo publishes, so both providers fail the same way. */
const FORECAST_DAYS = 16

type Canned = Omit<Forecast, 'date'>

/**
 * A fixed day of weather, chosen so the seeded plans exercise the interesting
 * cases: heat that nothing in the rules layer notices, rain that matters
 * outdoors and does not matter on the fourteenth floor, and wind.
 *
 * This is what `WEATHER_MODE=fixture` serves. It exists so an interview is
 * reproducible and so the tests do not depend on the weather, not because live
 * data is a problem.
 */
const CANNED: Record<string, Canned> = {
  'Seattle, WA': {
    resolvedLocation: 'Seattle, Washington, US',
    highC: 14,
    lowC: 9,
    precipitationMm: 8.2,
    chanceOfRainPct: 85,
    windKph: 18,
    summary: 'Rain',
  },
  'Phoenix, AZ': {
    resolvedLocation: 'Phoenix, Arizona, US',
    highC: 41,
    lowC: 28,
    precipitationMm: 0,
    chanceOfRainPct: 0,
    windKph: 12,
    summary: 'Clear',
  },
  'Denver, CO': {
    resolvedLocation: 'Denver, Colorado, US',
    highC: 18,
    lowC: 7,
    precipitationMm: 0.4,
    chanceOfRainPct: 20,
    windKph: 46,
    summary: 'Partly cloudy',
  },
  'Chicago, IL': {
    resolvedLocation: 'Chicago, Illinois, US',
    highC: 17,
    lowC: 11,
    precipitationMm: 6.5,
    chanceOfRainPct: 75,
    windKph: 25,
    summary: 'Rain',
  },
  'Miami, FL': {
    resolvedLocation: 'Miami, Florida, US',
    highC: 31,
    lowC: 26,
    precipitationMm: 12,
    chanceOfRainPct: 90,
    windKph: 38,
    summary: 'Thunderstorms',
  },
  'Boston, MA': {
    resolvedLocation: 'Boston, Massachusetts, US',
    highC: 19,
    lowC: 11,
    precipitationMm: 0,
    chanceOfRainPct: 10,
    windKph: 20,
    summary: 'Mostly clear',
  },
}

export const fixtureProvider: WeatherProvider = {
  async forecastFor(plan: Plan): Promise<ForecastResult> {
    const canned = CANNED[plan.city]

    if (!canned) {
      return {
        ok: false,
        reason: 'city_not_found',
        detail: `Could not find a place called "${plan.city}".`,
      }
    }

    const lastDay = addDays(today(), FORECAST_DAYS - 1)
    if (plan.date > lastDay) {
      return {
        ok: false,
        reason: 'out_of_range',
        detail: `Forecasts only reach ${lastDay}.`,
      }
    }

    return { ok: true, forecast: { ...canned, date: plan.date } }
  },
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function addDays(isoDay: string, days: number): string {
  const date = new Date(`${isoDay}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
