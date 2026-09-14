import type { RecordSource, SearchSubject, SourceResult } from '@smartskip/shared'
import { RECORD_SOURCES, SOURCE_LABELS } from '@smartskip/shared'
import { forcedFailures, vendorRecords } from '../data/vendorRecords'

/**
 * Stands in for the paid data providers we buy from in production. We cannot
 * hand out live vendor credentials for an interview, so this reads a fixture,
 * takes a realistic moment to answer, and fails the way a real vendor fails.
 *
 * Treat it as a network call you do not control: it is slow, it is sometimes
 * down, and it is the only part of this file you should assume is honest.
 */
export async function queryVendors(subject: SearchSubject): Promise<SourceResult[]> {
  return Promise.all(RECORD_SOURCES.map((source) => queryOne(source, subject)))
}

async function queryOne(
  source: RecordSource,
  subject: SearchSubject,
): Promise<SourceResult> {
  const startedAt = Date.now()
  await delay(120 + Math.random() * 280)

  if (forcedFailures[source]?.includes(subject.id)) {
    return {
      source,
      records: [],
      error: `${SOURCE_LABELS[source]} returned 503`,
      elapsedMs: Date.now() - startedAt,
    }
  }

  const records = vendorRecords.filter(
    (record) => record.subjectId === subject.id && record.source === source,
  )

  return {
    source,
    records: structuredClone(records),
    elapsedMs: Date.now() - startedAt,
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
