import { Router } from 'express'
import type { JobStatus } from '@smartskip/shared'
import { JOB_STATUSES } from '@smartskip/shared'
import { asyncHandler } from '../http/asyncHandler'
import { badRequest, notFound } from '../http/errors'
import { jobStore } from '../store/jobStore'
import { fetchJobForecast } from '../services/weather'

export const jobsRouter: Router = Router()

/**
 * GET /api/jobs?status=scheduled
 *
 * Reference implementation. The remaining handlers in this file follow the same
 * shape: validate input, talk to the store, return JSON.
 */
jobsRouter.get('/', (req, res) => {
  const status = req.query.status

  if (status !== undefined && !isJobStatus(status)) {
    throw badRequest(`Unknown status "${String(status)}"`, {
      allowed: JOB_STATUSES,
    })
  }

  res.json(jobStore.list({ status }))
})

/** GET /api/jobs/:id */
jobsRouter.get('/:id', (req, res) => {
  const job = jobStore.find(req.params.id)
  if (!job) throw notFound(`No job with id "${req.params.id}"`)

  res.json(job)
})

/**
 * TODO(candidate): POST /api/jobs
 *
 * Validate the body against `CreateJobInput`, reject anything malformed with a
 * 400 that explains what is wrong, and return the created job with a 201.
 */
jobsRouter.post('/', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * TODO(candidate): PATCH /api/jobs/:id
 *
 * Partial update. Unknown ids should 404 rather than silently creating a job.
 */
jobsRouter.patch('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * TODO(candidate): DELETE /api/jobs/:id
 */
jobsRouter.delete('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * GET /api/jobs/:id/forecast
 *
 * Wired up for you, but the provider call behind it is a stub.
 * See `src/services/weather.ts`.
 */
jobsRouter.get(
  '/:id/forecast',
  asyncHandler<{ id: string }>(async (req, res) => {
    const job = jobStore.find(req.params.id)
    if (!job) throw notFound(`No job with id "${req.params.id}"`)

    res.json(await fetchJobForecast(job))
  }),
)

function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === 'string' && (JOB_STATUSES as readonly string[]).includes(value)
}
