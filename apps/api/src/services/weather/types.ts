import type { Forecast, ForecastProblem, Plan } from '@smartskip/shared'

/**
 * Not finding a forecast is an ordinary outcome, so it comes back as a value
 * rather than an exception. Callers have to look at `ok` before reading on.
 */
export type ForecastResult =
  | { ok: true; forecast: Forecast }
  | { ok: false; reason: ForecastProblem; detail: string }

export interface WeatherProvider {
  forecastFor(plan: Plan): Promise<ForecastResult>
}
