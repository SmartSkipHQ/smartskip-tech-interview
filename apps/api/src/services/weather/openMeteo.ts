import type { Plan } from '@smartskip/shared'
import { US_STATES } from '../../data/usStates'
import { describeWeatherCode } from '../../data/weatherCodes'
import { TtlCache } from '../cache'
import type { ForecastResult, WeatherProvider } from './types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

/** Open-Meteo publishes 16 days. Anything past that has no answer, not a bad one. */
const FORECAST_DAYS = 16

const REQUEST_TIMEOUT_MS = 8_000

interface Place {
  label: string
  latitude: number
  longitude: number
}

/** Cities do not move. Forecasts do, but not by the minute. */
const placeCache = new TtlCache<Place | null>(24 * 60 * 60 * 1000)
const forecastCache = new TtlCache<DailyBlock | null>(30 * 60 * 1000)

export const openMeteoProvider: WeatherProvider = {
  async forecastFor(plan: Plan): Promise<ForecastResult> {
    let place: Place | null
    let daily: DailyBlock | null

    try {
      place = await placeCache.wrap(plan.city, () => geocode(plan.city))
      if (!place) {
        return {
          ok: false,
          reason: 'city_not_found',
          detail: `Could not find a place called "${plan.city}".`,
        }
      }

      daily = await forecastCache.wrap(cacheKey(place), () => fetchDaily(place as Place))
    } catch (cause) {
      return {
        ok: false,
        reason: 'upstream_error',
        detail: cause instanceof Error ? cause.message : 'Weather lookup failed.',
      }
    }

    if (!daily) {
      return { ok: false, reason: 'upstream_error', detail: 'Weather lookup failed.' }
    }

    const index = daily.time.indexOf(plan.date)
    if (index === -1) {
      return {
        ok: false,
        reason: 'out_of_range',
        detail: `Forecasts only reach ${daily.time[daily.time.length - 1]}.`,
      }
    }

    return {
      ok: true,
      forecast: {
        resolvedLocation: place.label,
        date: plan.date,
        highC: daily.high[index] ?? 0,
        lowC: daily.low[index] ?? 0,
        precipitationMm: daily.precipitation[index] ?? 0,
        chanceOfRainPct: daily.rainChance[index] ?? 0,
        windKph: daily.wind[index] ?? 0,
        summary: describeWeatherCode(daily.code[index]),
      },
    }
  },
}

/**
 * "Phoenix, AZ" is two pieces of information and the geocoder only takes one,
 * so the state is used to pick between the matches it returns. Without it the
 * first Phoenix in the list wins, and there are three.
 */
async function geocode(city: string): Promise<Place | null> {
  const [name = city, region] = city.split(',').map((part) => part.trim())

  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', name)
  url.searchParams.set('count', '10')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const body = (await getJson(url)) as {
    results?: {
      name: string
      latitude: number
      longitude: number
      admin1?: string
      country_code?: string
    }[]
  }

  const results = body.results ?? []
  if (!results.length) return null

  const wantedState = region ? US_STATES[region.toUpperCase()] : undefined
  const match =
    (wantedState && results.find((result) => result.admin1 === wantedState)) ??
    (region && results.find((result) => result.country_code === region.toUpperCase())) ??
    results[0]

  if (!match) return null

  return {
    label: [match.name, match.admin1, match.country_code].filter(Boolean).join(', '),
    latitude: match.latitude,
    longitude: match.longitude,
  }
}

interface DailyBlock {
  time: string[]
  high: number[]
  low: number[]
  precipitation: number[]
  rainChance: number[]
  wind: number[]
  code: number[]
}

async function fetchDaily(place: Place): Promise<DailyBlock> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', String(place.latitude))
  url.searchParams.set('longitude', String(place.longitude))
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
  )
  url.searchParams.set('forecast_days', String(FORECAST_DAYS))
  url.searchParams.set('timezone', 'auto')

  const body = (await getJson(url)) as {
    daily?: {
      time: string[]
      weather_code: number[]
      temperature_2m_max: number[]
      temperature_2m_min: number[]
      precipitation_sum: number[]
      precipitation_probability_max: (number | null)[]
      wind_speed_10m_max: number[]
    }
  }

  if (!body.daily) throw new Error('Weather provider returned no daily block.')

  return {
    time: body.daily.time,
    high: body.daily.temperature_2m_max,
    low: body.daily.temperature_2m_min,
    precipitation: body.daily.precipitation_sum,
    rainChance: body.daily.precipitation_probability_max.map((value) => value ?? 0),
    wind: body.daily.wind_speed_10m_max,
    code: body.daily.weather_code,
  }
}

async function getJson(url: URL): Promise<unknown> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Weather provider replied ${response.status}.`)
  }

  return response.json()
}

const cacheKey = (place: Place) => `${place.latitude},${place.longitude}`

/** Exposed for tests; the caches are process-wide and otherwise leak between them. */
export function clearWeatherCaches(): void {
  placeCache.clear()
  forecastCache.clear()
}
