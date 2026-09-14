import type { Forecast, Plan } from '@smartskip/shared'
import { fallbackForecast, sampleForecasts } from '../data/sampleForecasts'

/**
 * TODO(candidate): fetch the real forecast.
 *
 * Right now this returns canned numbers from `src/data/sampleForecasts.ts` so
 * that the app has something to draw. Replace it with Open-Meteo, which is free
 * and needs no API key. It takes two calls:
 *
 *   1. City name -> coordinates
 *      https://geocoding-api.open-meteo.com/v1/search?name=Phoenix&count=1
 *
 *   2. Coordinates -> daily forecast
 *      https://api.open-meteo.com/v1/forecast
 *        ?latitude=33.45&longitude=-112.07
 *        &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,
 *               precipitation_probability_max,wind_speed_10m_max
 *        &forecast_days=7&timezone=auto
 *
 * Remember to set `source` to `'open-meteo'` once the numbers are real; the UI
 * shows a warning while they are samples.
 *
 * Worth thinking about, roughly in order:
 *   - the response is arrays indexed by day; pick the one matching `plan.date`
 *   - a plan more than a week out has no forecast at all. What then?
 *   - "Phoenix, AZ" is not what the geocoder expects. Whose job is that?
 *   - five plans means ten upstream calls, and the cities repeat
 *   - the upstream can be slow or down; decide what this returns then
 */
export async function fetchForecast(plan: Plan): Promise<Forecast> {
  const sample = sampleForecasts[plan.city] ?? fallbackForecast

  return {
    ...sample,
    city: plan.city,
    date: plan.date,
    source: 'sample',
  }
}
