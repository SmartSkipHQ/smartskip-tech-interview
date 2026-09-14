import { Router } from 'express'
import type { SubjectStatus } from '@smartskip/shared'
import { SUBJECT_STATUSES } from '@smartskip/shared'
import { asyncHandler } from '../http/asyncHandler'
import { badRequest, notFound } from '../http/errors'
import { subjectStore } from '../store/subjectStore'
import { runSearch } from '../services/search'
import { getIdentityResolver } from '../services/ai'

export const subjectsRouter: Router = Router()

/**
 * GET /api/subjects?status=searching
 *
 * Reference implementation. The remaining handlers in this file follow the same
 * shape: validate input, talk to the store, return JSON.
 */
subjectsRouter.get('/', (req, res) => {
  const status = req.query.status

  if (status !== undefined && !isSubjectStatus(status)) {
    throw badRequest(`Unknown status "${String(status)}"`, {
      allowed: SUBJECT_STATUSES,
    })
  }

  res.json(subjectStore.list({ status }))
})

/** GET /api/subjects/:id */
subjectsRouter.get('/:id', (req, res) => {
  const subject = subjectStore.find(req.params.id)
  if (!subject) throw notFound(`No subject with id "${req.params.id}"`)

  res.json(subject)
})

/**
 * TODO(candidate): POST /api/subjects
 *
 * Validate the body against `CreateSubjectInput`, reject anything malformed
 * with a 400 that explains what is wrong, and return the created subject
 * with a 201.
 */
subjectsRouter.post('/', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * TODO(candidate): PATCH /api/subjects/:id
 *
 * Partial update. Unknown ids should 404 rather than silently creating one.
 */
subjectsRouter.patch('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * TODO(candidate): DELETE /api/subjects/:id
 */
subjectsRouter.delete('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * GET /api/subjects/:id/records
 *
 * Raw vendor output, one entry per source, failures included. This is the
 * mess the resolver has to make sense of.
 */
subjectsRouter.get(
  '/:id/records',
  asyncHandler<{ id: string }>(async (req, res) => {
    const subject = subjectStore.find(req.params.id)
    if (!subject) throw notFound(`No subject with id "${req.params.id}"`)

    const { sources } = await runSearch(subject)
    res.json(sources)
  }),
)

/**
 * GET /api/subjects/:id/resolution
 *
 * Runs the search and hands everything to the resolver. Swap the
 * implementation behind it with AI_PROVIDER in `.env`.
 */
subjectsRouter.get(
  '/:id/resolution',
  asyncHandler<{ id: string }>(async (req, res) => {
    const subject = subjectStore.find(req.params.id)
    if (!subject) throw notFound(`No subject with id "${req.params.id}"`)

    const { sources, records } = await runSearch(subject)
    const resolution = await getIdentityResolver().resolve({ subject, records, sources })

    res.json(resolution)
  }),
)

function isSubjectStatus(value: unknown): value is SubjectStatus {
  return (
    typeof value === 'string' && (SUBJECT_STATUSES as readonly string[]).includes(value)
  )
}
