import type { Forecast } from '@smartskip/shared'

/**
 * Canned weather, so the app has something to show before anyone writes a line
 * of code. These are invented numbers, not a forecast. Replacing them with a
 * real provider is the second task in the README.
 */
export const sampleForecasts: Record<string, Omit<Forecast, 'city' | 'date' | 'source'>> =
  {
    'Phoenix, AZ': {
      highC: 38,
      lowC: 26,
      precipitationMm: 0,
      chanceOfRainPct: 0,
      windKph: 12,
      summary: 'Clear and hot',
    },
    'Denver, CO': {
      highC: 18,
      lowC: 7,
      precipitationMm: 0.4,
      chanceOfRainPct: 20,
      windKph: 46,
      summary: 'Dry but very windy',
    },
    'Seattle, WA': {
      highC: 14,
      lowC: 9,
      precipitationMm: 8.2,
      chanceOfRainPct: 85,
      windKph: 18,
      summary: 'Steady rain',
    },
    'Chicago, IL': {
      highC: 17,
      lowC: 11,
      precipitationMm: 6.5,
      chanceOfRainPct: 75,
      windKph: 25,
      summary: 'Rain most of the day',
    },
    'Miami, FL': {
      highC: 31,
      lowC: 26,
      precipitationMm: 12,
      chanceOfRainPct: 90,
      windKph: 38,
      summary: 'Thunderstorms',
    },
  }

/** Anything we have no sample for gets a bland, unhelpful day. */
export const fallbackForecast: Omit<Forecast, 'city' | 'date' | 'source'> = {
  highC: 21,
  lowC: 13,
  precipitationMm: 0,
  chanceOfRainPct: 10,
  windKph: 15,
  summary: 'No sample data for this city',
}
