import type { SearchRecord, SearchSubject, SourceResult } from '@smartskip/shared'
import { enrichWithLocation } from './geo'
import { queryVendors } from './vendors'

export interface SearchOutcome {
  sources: SourceResult[]
  /** Every record from every source that answered, flattened. */
  records: SearchRecord[]
}

/**
 * Ask every vendor, then enrich whatever came back. Sources that failed are
 * kept in the result rather than dropped, so the caller can say so.
 */
export async function runSearch(subject: SearchSubject): Promise<SearchOutcome> {
  const sources = await queryVendors(subject)
  const records = await enrichWithLocation(
    subject,
    sources.flatMap((source) => source.records),
  )

  const enrichedById = new Map(records.map((record) => [record.id, record]))

  return {
    sources: sources.map((source) => ({
      ...source,
      records: source.records.map((record) => enrichedById.get(record.id) ?? record),
    })),
    records,
  }
}
