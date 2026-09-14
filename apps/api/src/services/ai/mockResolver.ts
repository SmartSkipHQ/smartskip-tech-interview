import type { IdentityFlag, Resolution, ResolvedIdentity, SearchRecord } from '@smartskip/shared'
import { formatAddress } from '@smartskip/shared'
import type { IdentityResolver, ResolutionContext } from './types'

/**
 * Deterministic stand-in so the app is usable with no credentials.
 *
 * It groups records by surname and stops thinking there. On the seeded data
 * that is enough to look plausible and still be wrong in a way you can see on
 * screen. Beating it is the point of the exercise, and it should not be hard.
 */
export const mockResolver: IdentityResolver = {
  async resolve(context: ResolutionContext): Promise<Resolution> {
    const clusters = new Map<string, SearchRecord[]>()

    for (const record of context.records) {
      const key = surnameOf(record.fullName)
      const bucket = clusters.get(key)
      if (bucket) bucket.push(record)
      else clusters.set(key, [record])
    }

    const identities = [...clusters.values()]
      .map(toIdentity)
      .sort((a, b) => b.confidence - a.confidence)

    return {
      subjectId: context.subject.id,
      identities,
      generatedAt: new Date().toISOString(),
      source: 'mock',
    }
  },
}

function toIdentity(records: SearchRecord[]): ResolvedIdentity {
  const byRecency = [...records].sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))
  const withAddress = byRecency.find((record) => record.address)
  const phones = records.flatMap((record) => record.phones)
  const bestPhone = phones.find((phone) => phone.active === true) ?? phones[0]

  const flags: IdentityFlag[] = []

  if (records.length < 2) {
    flags.push({
      code: 'thin_data',
      severity: 'warning',
      message: 'Only one source reported anything. Nothing here is corroborated.',
    })
  }

  if (phones.some((phone) => phone.active === false)) {
    flags.push({
      code: 'disconnected_phone',
      severity: 'info',
      message: 'At least one number on file is no longer in service.',
    })
  }

  if (withAddress && olderThanDays(withAddress.reportedAt, 365)) {
    flags.push({
      code: 'stale_address',
      severity: 'warning',
      message: 'The most recent address on file is over a year old.',
    })
  }

  const confidence = Math.min(80, 40 + records.length * 12)

  return {
    label: 'Primary match',
    confidence,
    recordIds: records.map((record) => record.id),
    bestAddress: withAddress?.address,
    bestPhone: bestPhone?.number,
    flags,
    rationale: `${records.length} record(s) share the surname "${surnameOf(
      records[0]?.fullName ?? '',
    )}", so they were grouped together.${
      withAddress?.address
        ? ` The freshest address among them is ${formatAddress(withAddress.address)}.`
        : ' None of them carry an address.'
    }`,
  }
}

function surnameOf(fullName: string): string {
  const parts = fullName.trim().toLowerCase().replace(/[.,]/g, '').split(/\s+/)
  return parts[parts.length - 1] ?? ''
}

function olderThanDays(iso: string, days: number): boolean {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return new Date(iso).getTime() < cutoff
}
