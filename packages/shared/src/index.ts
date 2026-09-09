/**
 * Types shared by the API and the web app. Both workspaces import this package,
 * so a change here is immediately visible on both sides of the wire.
 */

export type JobType = 'delivery' | 'collection' | 'exchange'

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

/** Skip capacity in cubic yards. */
export type SkipSize = 4 | 6 | 8 | 12 | 16

export interface Coordinates {
  lat: number
  lon: number
}

export interface Job {
  id: string
  /** Human friendly reference shown to customers, e.g. "SS-1042". */
  reference: string
  customerName: string
  address: string
  location: Coordinates
  /** ISO 8601 timestamp of the booked slot. */
  scheduledFor: string
  type: JobType
  status: JobStatus
  skipSize: SkipSize
  notes?: string
  createdAt: string
  updatedAt: string
}

/** Fields a client may send when creating a job. */
export interface CreateJobInput {
  customerName: string
  address: string
  location: Coordinates
  scheduledFor: string
  type: JobType
  skipSize: SkipSize
  status?: JobStatus
  notes?: string
}

/** Every field is optional on update; only what is sent gets changed. */
export type UpdateJobInput = Partial<CreateJobInput>

/**
 * Weather for the hours around a job, normalised so the UI never has to know
 * which provider it came from.
 */
export interface JobForecast {
  jobId: string
  /** ISO timestamp the forecast refers to. */
  observedFor: string
  temperatureC: number
  precipitationMm: number
  windSpeedKph: number
  /** Short human readable label, e.g. "Heavy rain". */
  summary: string
}

/** One leg of the planned round trip, depot -> job -> job -> ... -> depot. */
export interface RouteLeg {
  fromJobId: string | null
  toJobId: string | null
  distanceKm: number
  durationMin: number
}

export interface RoutePlan {
  /** Job ids in the order they should be visited. */
  order: string[]
  legs: RouteLeg[]
  totalDistanceKm: number
  totalDurationMin: number
}

export type BriefingSeverity = 'info' | 'warning' | 'critical'

export interface BriefingItem {
  jobId: string
  severity: BriefingSeverity
  /** One sentence a dispatcher can act on. */
  message: string
}

export interface DayBriefing {
  /** ISO date the briefing covers, e.g. "2026-09-10". */
  date: string
  headline: string
  items: BriefingItem[]
  generatedAt: string
  /** Which implementation produced this, useful while developing. */
  source: 'mock' | 'anthropic'
}

export interface ApiError {
  error: string
  details?: unknown
}

/** The yard every round trip starts and ends at. */
export const DEPOT: Coordinates = { lat: 53.4808, lon: -2.2426 }

export const JOB_TYPES: readonly JobType[] = ['delivery', 'collection', 'exchange']

export const JOB_STATUSES: readonly JobStatus[] = [
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
]

export const SKIP_SIZES: readonly SkipSize[] = [4, 6, 8, 12, 16]
