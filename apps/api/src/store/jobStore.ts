import type { CreateJobInput, Job, JobStatus, UpdateJobInput } from '@smartskip/shared'
import { seedJobs } from '../data/seed'

/**
 * In-memory persistence. Deliberately simple: swapping this for a real database
 * should not require touching the routes.
 */
export class JobStore {
  #jobs = new Map<string, Job>()
  #sequence = 0

  constructor(initial: Job[] = []) {
    this.reset(initial)
  }

  reset(initial: Job[] = []): void {
    this.#jobs = new Map(initial.map((job) => [job.id, structuredClone(job)]))
    this.#sequence = initial.length
  }

  list(filter: { status?: JobStatus } = {}): Job[] {
    const jobs = [...this.#jobs.values()]
    const matching = filter.status
      ? jobs.filter((job) => job.status === filter.status)
      : jobs

    return matching.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
  }

  find(id: string): Job | undefined {
    return this.#jobs.get(id)
  }

  create(input: CreateJobInput): Job {
    this.#sequence += 1
    const timestamp = new Date().toISOString()

    const job: Job = {
      ...input,
      id: `job_${String(this.#sequence).padStart(2, '0')}`,
      reference: `SS-${1040 + this.#sequence}`,
      status: input.status ?? 'scheduled',
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    this.#jobs.set(job.id, job)
    return job
  }

  update(id: string, patch: UpdateJobInput): Job | undefined {
    const current = this.#jobs.get(id)
    if (!current) return undefined

    const updated: Job = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    this.#jobs.set(id, updated)
    return updated
  }

  remove(id: string): boolean {
    return this.#jobs.delete(id)
  }
}

/** Single instance shared by the routes for the lifetime of the process. */
export const jobStore = new JobStore(seedJobs)
