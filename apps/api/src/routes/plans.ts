import { Router } from 'express'
import { asyncHandler } from '../http/asyncHandler'
import { notFound } from '../http/errors'
import { planStore } from '../store/planStore'
import { fetchForecast } from '../services/weather'
import { getAdvisor } from '../services/ai'

export const plansRouter: Router = Router()

/**
 * GET /api/plans
 *
 * Reference implementation. The remaining handlers in this file follow the same
 * shape: validate input, talk to the store, return JSON.
 */
plansRouter.get('/', (_req, res) => {
  res.json(planStore.list())
})

/** GET /api/plans/:id */
plansRouter.get('/:id', (req, res) => {
  const plan = planStore.find(req.params.id)
  if (!plan) throw notFound(`No plan with id "${req.params.id}"`)

  res.json(plan)
})

/**
 * TODO(candidate): POST /api/plans
 *
 * Validate the body against `CreatePlanInput`, reject anything malformed with a
 * 400 that explains what is wrong, and return the created plan with a 201.
 */
plansRouter.post('/', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * TODO(candidate): PATCH /api/plans/:id
 *
 * Partial update. Unknown ids should 404 rather than silently creating a plan.
 */
plansRouter.patch('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * TODO(candidate): DELETE /api/plans/:id
 */
plansRouter.delete('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * GET /api/plans/:id/advice
 *
 * The weather for that plan plus what to do about it. One call so a card can
 * draw itself. Both halves behind it are stubs: see `src/services/weather.ts`
 * and `src/services/ai/`.
 */
plansRouter.get(
  '/:id/advice',
  asyncHandler<{ id: string }>(async (req, res) => {
    const plan = planStore.find(req.params.id)
    if (!plan) throw notFound(`No plan with id "${req.params.id}"`)

    const forecast = await fetchForecast(plan)
    const advice = await getAdvisor().advise({ plan, forecast })

    res.json({ plan, forecast, advice })
  }),
)
