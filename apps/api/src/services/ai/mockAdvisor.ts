import type { Advice, Verdict } from '@smartskip/shared'
import type { AdviceContext, Advisor } from './types'

/**
 * Deterministic stand-in so the app is usable with no credentials.
 *
 * It looks at two numbers and nothing else. In particular it never reads the
 * plan's title, so it cannot tell a barbecue from a meeting on the fourteenth
 * floor, and it has no opinion about heat. On the seeded data that is enough to
 * be visibly wrong. Beating it is the point of the exercise.
 */
export const mockAdvisor: Advisor = {
  async advise(context: AdviceContext): Promise<Advice> {
    const { precipitationMm, windKph } = context.forecast

    let verdict: Verdict = 'go'
    let reason = 'Nothing in the forecast stands out.'

    if (precipitationMm >= 5) {
      verdict = 'reschedule'
      reason = `${precipitationMm} mm of rain is forecast.`
    } else if (windKph >= 40) {
      verdict = 'maybe'
      reason = `Winds around ${Math.round(windKph)} km/h.`
    } else if (precipitationMm >= 1) {
      verdict = 'maybe'
      reason = 'Some rain is forecast.'
    }

    return {
      planId: context.plan.id,
      verdict,
      reason,
      generatedAt: new Date().toISOString(),
      source: 'mock',
    }
  },
}
