/**
 * Types shared by the API and the web app. Both workspaces import this package,
 * so a change here is immediately visible on both sides of the wire.
 *
 * All data in this exercise is synthetic. Never load real consumer data into it.
 */

export interface Coordinates {
  lat: number
  lon: number
}

export interface PostalAddress {
  line1: string
  city: string
  /** Two letter US state code. */
  state: string
  postalCode: string
}

/** How far along we are on a given subject. */
export type SubjectStatus = 'new' | 'searching' | 'resolved' | 'cold'

/** The person we are trying to locate. */
export interface SearchSubject {
  id: string
  /** Case reference shown to the client, e.g. "SK-2041". */
  reference: string
  fullName: string
  /** Last phone number the client had for them, E.164-ish. */
  knownPhone?: string
  lastKnownAddress?: PostalAddress
  status: SubjectStatus
  openedAt: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSubjectInput {
  fullName: string
  knownPhone?: string
  lastKnownAddress?: PostalAddress
  status?: SubjectStatus
  notes?: string
}

export type UpdateSubjectInput = Partial<CreateSubjectInput>

/** Which vendor a record came from. Mirrors the real providers we buy from. */
export type RecordSource = 'idi' | 'public_records' | 'telco'

export type LineType = 'mobile' | 'landline' | 'voip' | 'unknown'

export interface PhoneRecord {
  number: string
  lineType: LineType
  carrier?: string
  /** `null` means nobody has checked, which is not the same as "disconnected". */
  active: boolean | null
  /** ISO date the vendor last saw activity on this line. */
  lastSeen?: string
}

export type RelationKind = 'parent' | 'sibling' | 'spouse' | 'child' | 'associate'

export interface Relationship {
  fullName: string
  relation: RelationKind
  age?: number
}

/**
 * One candidate match, exactly as a vendor reported it. Vendors disagree with
 * each other constantly; that disagreement is the whole problem.
 */
export interface SearchRecord {
  id: string
  subjectId: string
  source: RecordSource
  fullName: string
  age?: number
  address?: PostalAddress
  phones: PhoneRecord[]
  relatives: Relationship[]
  /** ISO date the vendor says this information was current. */
  reportedAt: string
  /** Filled in by the geo enrichment step, absent until then. */
  coordinates?: Coordinates
  /** Straight-line km from the subject's last known address, once enriched. */
  distanceFromLastKnownKm?: number
}

/**
 * A vendor call either returns records or fails. Modelling the failure per
 * source means one bad vendor does not sink the whole search.
 */
export interface SourceResult {
  source: RecordSource
  records: SearchRecord[]
  error?: string
  /** Round trip time in ms, handy when you start worrying about latency. */
  elapsedMs: number
}

export type IdentityFlagCode =
  | 'stale_address'
  | 'disconnected_phone'
  | 'possible_namesake'
  | 'distant_match'
  | 'thin_data'

export type FlagSeverity = 'info' | 'warning' | 'critical'

export interface IdentityFlag {
  code: IdentityFlagCode
  severity: FlagSeverity
  message: string
}

/**
 * A cluster of records the resolver believes describe one human being, with a
 * reason a investigator can argue with.
 */
export interface ResolvedIdentity {
  /** Short label, e.g. "Primary match" or "Possible namesake". */
  label: string
  /** 0-100. Be honest rather than confident. */
  confidence: number
  recordIds: string[]
  bestAddress?: PostalAddress
  bestPhone?: string
  flags: IdentityFlag[]
  /** One paragraph explaining the call, in plain English. */
  rationale: string
}

export interface Resolution {
  subjectId: string
  /** Sorted by confidence, best first. */
  identities: ResolvedIdentity[]
  generatedAt: string
  /** Which implementation produced this, useful while developing. */
  source: 'mock' | 'anthropic'
}

export interface ApiError {
  error: string
  details?: unknown
}

export const SUBJECT_STATUSES: readonly SubjectStatus[] = [
  'new',
  'searching',
  'resolved',
  'cold',
]

export const RECORD_SOURCES: readonly RecordSource[] = ['idi', 'public_records', 'telco']

/** Vendor slugs are not presentable, so keep the labels next to them. */
export const SOURCE_LABELS: Record<RecordSource, string> = {
  idi: 'IDI',
  public_records: 'Public records',
  telco: 'Telco',
}

export function formatAddress(address: PostalAddress): string {
  return `${address.line1}, ${address.city}, ${address.state} ${address.postalCode}`
}
