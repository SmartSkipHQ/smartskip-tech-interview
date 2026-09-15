/**
 * Types shared by the API and the web app. Both workspaces import this package,
 * so a change here is immediately visible on both sides of the wire.
 */

/** Something the user intends to do, on a day, in a place. */
export interface Plan {
  id: string
  /** Free text, e.g. "Backyard barbecue". The wording carries a lot of meaning. */
  title: string
  /** City as a human would type it, e.g. "Phoenix, AZ". */
  city: string
  /** ISO day, e.g. "2026-09-19". */
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePlanInput {
  title: string
  city: string
  date: string
  notes?: string
}

export type UpdatePlanInput = Partial<CreatePlanInput>

/** Weather for one city on one day, normalised so the UI stays provider-agnostic. */
export interface Forecast {
  /** What the provider actually matched, e.g. "Phoenix, Arizona, US". */
  resolvedLocation: string
  date: string
  highC: number
  lowC: number
  precipitationMm: number
  chanceOfRainPct: number
  windKph: number
  /** Short label, e.g. "Heavy rain". */
  summary: string
}

/** Why there is no forecast. Each one needs a different answer in the UI. */
export type ForecastProblem = 'city_not_found' | 'out_of_range' | 'upstream_error'

export type Verdict = 'go' | 'maybe' | 'reschedule'

export interface Advice {
  planId: string
  verdict: Verdict
  /** One sentence the user can act on. */
  reason: string
  /** A better day, if there is an obvious one. ISO day. */
  suggestedDate?: string
  generatedAt: string
  /** Which implementation produced this, useful while developing. */
  source: 'mock' | 'anthropic'
}

/**
 * What the UI needs to draw one card. A plan with no forecast is a normal
 * outcome, not an error, so `problem` explains it instead of throwing.
 */
export interface PlanAdvice {
  plan: Plan
  forecast: Forecast | null
  advice: Advice | null
  problem?: {
    reason: ForecastProblem
    detail: string
  }
}

export interface ApiError {
  error: string
  details?: unknown
}

export const VERDICT_LABELS: Record<Verdict, string> = {
  go: 'Go ahead',
  maybe: 'Your call',
  reschedule: 'Move it',
}
