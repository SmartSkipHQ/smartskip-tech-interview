import type { Plan } from '@smartskip/shared'
import { fixtureProvider } from './fixture'
import { openMeteoProvider } from './openMeteo'
import type { ForecastResult } from './types'

export type { ForecastResult, WeatherProvider } from './types'
export { clearWeatherCaches } from './openMeteo'

/**
 * Live Open-Meteo by default. `WEATHER_MODE=fixture` serves a fixed day
 * instead, which is how the interview is kept identical for everyone and how
 * the tests avoid depending on the network.
 */
export function getWeatherProvider() {
  return process.env.WEATHER_MODE === 'fixture' ? fixtureProvider : openMeteoProvider
}

export function fetchForecast(plan: Plan): Promise<ForecastResult> {
  return getWeatherProvider().forecastFor(plan)
}
