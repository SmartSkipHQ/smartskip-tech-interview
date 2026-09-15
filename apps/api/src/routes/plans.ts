import { Router } from 'express'
import type { PlanAdvice } from '@smartskip/shared'
import { asyncHandler } from '../http/asyncHandler'
import { badRequest, notFound } from '../http/errors'
import { planStore } from '../store/planStore'
import { fetchForecast } from '../services/weather'
import { getAdvisor, isAdvisorName } from '../services/ai'

export const plansRouter: Router = Router()

/**
 * GET /api/plans
 *
 * Reference implementation. The handler below it follows the same shape:
 * validate input, talk to the store, return JSON.
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
 * The one write operation in this exercise. Validate the body against
 * `CreatePlanInput`, reject anything malformed with a 400 that explains what is
 * wrong, and return the created plan with a 201.
 *
 * `planStore.create` is already there and already works. The interesting part
 * is deciding what counts as a valid plan: what happens to a date in the past,
 * an empty title, a city that is three hundred characters of nonsense.
 */
plansRouter.post('/', (_req, res) => {
  res.status(501).json({ error: 'Not implemented yet' })
})

/**
 * GET /api/plans/:id/advice?provider=mock|anthropic
 *
 * The weather for that plan plus what to do about it, in one call so a card can
 * draw itself. `provider` overrides AI_PROVIDER for this request, which is how
 * you compare two implementations on the same plan.
 *
 * A plan with no forecast is an ordinary outcome, not a 500. The response says
 * so in `problem` and the card renders it.
 */
plansRouter.get(
  '/:id/advice',
  asyncHandler<{ id: string }>(async (req, res) => {
    const plan = planStore.find(req.params.id)
    if (!plan) throw notFound(`No plan with id "${req.params.id}"`)

    const override = req.query.provider
    if (override !== undefined && !isAdvisorName(override)) {
      throw badRequest(`Unknown provider "${String(override)}"`, {
        allowed: ['mock', 'anthropic'],
      })
    }

    const result = await fetchForecast(plan)

    if (!result.ok) {
      const body: PlanAdvice = {
        plan,
        forecast: null,
        advice: null,
        problem: { reason: result.reason, detail: result.detail },
      }

      res.json(body)
      return
    }

    const advice = await getAdvisor(override).advise({ plan, forecast: result.forecast })

    const body: PlanAdvice = { plan, forecast: result.forecast, advice }
    res.json(body)
  }),
)
