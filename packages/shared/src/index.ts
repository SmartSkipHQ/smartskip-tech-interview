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
  city: string
  date: string
  highC: number
  lowC: number
  precipitationMm: number
  chanceOfRainPct: number
  windKph: number
  /** Short label, e.g. "Heavy rain". */
  summary: string
  /** Where the numbers came from. Sample data is not real weather. */
  source: 'sample' | 'open-meteo'
}

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

/** What the UI needs to draw one card. */
export interface PlanAdvice {
  plan: Plan
  forecast: Forecast
  advice: Advice
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
