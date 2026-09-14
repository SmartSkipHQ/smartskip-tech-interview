import type { Advice, Forecast, Plan } from '@smartskip/shared'

/** Everything the advisor is allowed to reason about. */
export interface AdviceContext {
  plan: Plan
  forecast: Forecast
}

export interface Advisor {
  advise(context: AdviceContext): Promise<Advice>
}

export type { Advice }
