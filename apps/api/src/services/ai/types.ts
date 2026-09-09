import type { DayBriefing, Job, JobForecast, RoutePlan } from '@smartskip/shared'

/** Everything the briefing layer is allowed to reason about. */
export interface BriefingContext {
  /** ISO date, e.g. "2026-09-10". */
  date: string
  jobs: Job[]
  forecasts: JobForecast[]
  route: RoutePlan
}

export interface BriefingGenerator {
  generate(context: BriefingContext): Promise<DayBriefing>
}
