import { Router } from 'express'
import type { Job } from '@smartskip/shared'
import { asyncHandler } from '../http/asyncHandler'
import { badRequest } from '../http/errors'
import { jobStore } from '../store/jobStore'
import { planRoute } from '../services/routing'
import { fetchJobForecast } from '../services/weather'
import { getBriefingGenerator } from '../services/ai'

export const insightsRouter: Router = Router()

/**
 * GET /api/route?date=2026-09-10
 *
 * Round trip for that day's active jobs. See `src/services/routing.ts`.
 */
insightsRouter.get(
  '/route',
  asyncHandler(async (req, res) => {
    const date = readDate(req.query.date)
    res.json(await planRoute(activeJobsOn(date)))
  }),
)

/**
 * GET /api/briefing?date=2026-09-10
 *
 * Collects the day's jobs, their forecasts and the planned route, then hands
 * the lot to the AI layer. Swap the provider with AI_PROVIDER in `.env`.
 */
insightsRouter.get(
  '/briefing',
  asyncHandler(async (req, res) => {
    const date = readDate(req.query.date)
    const jobs = activeJobsOn(date)

    const [forecasts, route] = await Promise.all([
      Promise.all(jobs.map(fetchJobForecast)),
      planRoute(jobs),
    ])

    const briefing = await getBriefingGenerator().generate({ date, jobs, forecasts, route })
    res.json(briefing)
  }),
)

/** Jobs still worth planning for: scheduled or already on the road. */
function activeJobsOn(date: string): Job[] {
  return jobStore
    .list()
    .filter(
      (job) =>
        job.scheduledFor.startsWith(date) &&
        (job.status === 'scheduled' || job.status === 'in_progress'),
    )
}

function readDate(value: unknown): string {
  if (value === undefined) return new Date().toISOString().slice(0, 10)

  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw badRequest('date must be an ISO day, e.g. 2026-09-10')
  }

  return value
}
