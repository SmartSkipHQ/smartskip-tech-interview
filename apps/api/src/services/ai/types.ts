import type { Resolution, SearchRecord, SearchSubject, SourceResult } from '@smartskip/shared'

/** Everything the resolver is allowed to reason about. */
export interface ResolutionContext {
  subject: SearchSubject
  /** Every record from every source that answered, already enriched. */
  records: SearchRecord[]
  /** Per-source outcome, including the ones that failed. */
  sources: SourceResult[]
}

export interface IdentityResolver {
  resolve(context: ResolutionContext): Promise<Resolution>
}
