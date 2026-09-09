import type { Job, JobForecast } from '@smartskip/shared'

/**
 * TODO(candidate): fetch the real forecast.
 *
 * Open-Meteo is free and needs no API key. The hourly endpoint takes a
 * coordinate pair and returns arrays you can index by timestamp:
 *
 *   https://api.open-meteo.com/v1/forecast
 *     ?latitude=53.4794&longitude=-2.2496
 *     &hourly=temperature_2m,precipitation,wind_speed_10m
 *     &forecast_days=3
 *
 * Things worth thinking about, in rough order of importance:
 *   - pick the hour that matches `job.scheduledFor`, not just the first one
 *   - one upstream call per job in a list of 50 jobs is a lot of calls
 *   - the upstream can be slow or down; decide what the API returns then
 *
 * Any other weather provider is fine if you prefer one.
 */
export async function fetchJobForecast(job: Job): Promise<JobForecast> {
  return {
    jobId: job.id,
    observedFor: job.scheduledFor,
    temperatureC: 0,
    precipitationMm: 0,
    windSpeedKph: 0,
    summary: 'Stubbed forecast, not wired to a provider yet',
  }
}
