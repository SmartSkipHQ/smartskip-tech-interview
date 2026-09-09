import type { BriefingItem, DayBriefing } from '@smartskip/shared'
import type { BriefingContext, BriefingGenerator } from './types'

/**
 * Deterministic stand-in for the model so the app is usable with no
 * credentials. It is intentionally naive: a handful of thresholds, no nuance.
 * Beating it is the point of the exercise.
 */
export const mockGenerator: BriefingGenerator = {
  async generate(context: BriefingContext): Promise<DayBriefing> {
    const forecastByJob = new Map(context.forecasts.map((f) => [f.jobId, f]))

    const items = context.jobs.flatMap<BriefingItem>((job) => {
      const forecast = forecastByJob.get(job.id)
      if (!forecast) return []

      if (forecast.precipitationMm >= 4) {
        return [
          {
            jobId: job.id,
            severity: 'critical',
            message: `${forecast.precipitationMm.toFixed(1)} mm of rain expected at ${job.address}; a ${job.skipSize} yard skip on soft ground is likely to sink.`,
          },
        ]
      }

      if (forecast.windSpeedKph >= 45) {
        return [
          {
            jobId: job.id,
            severity: 'warning',
            message: `Gusts near ${Math.round(forecast.windSpeedKph)} km/h at ${job.address}; lifting a skip over a fence is risky.`,
          },
        ]
      }

      return []
    })

    return {
      date: context.date,
      headline: items.length
        ? `${items.length} of ${context.jobs.length} jobs need attention.`
        : `${context.jobs.length} jobs, nothing flagged.`,
      items,
      generatedAt: new Date().toISOString(),
      source: 'mock',
    }
  },
}
