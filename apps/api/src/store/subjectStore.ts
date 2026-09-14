import type {
  CreateSubjectInput,
  SearchSubject,
  SubjectStatus,
  UpdateSubjectInput,
} from '@smartskip/shared'
import { seedSubjects } from '../data/subjects'

/**
 * In-memory persistence. Deliberately simple: swapping this for a real database
 * should not require touching the routes.
 */
export class SubjectStore {
  #subjects = new Map<string, SearchSubject>()
  #sequence = 0

  constructor(initial: SearchSubject[] = []) {
    this.reset(initial)
  }

  reset(initial: SearchSubject[] = []): void {
    this.#subjects = new Map(initial.map((s) => [s.id, structuredClone(s)]))
    this.#sequence = initial.length
  }

  list(filter: { status?: SubjectStatus } = {}): SearchSubject[] {
    const subjects = [...this.#subjects.values()]
    const matching = filter.status
      ? subjects.filter((s) => s.status === filter.status)
      : subjects

    // Most recently opened first: that is the order an investigator works in.
    return matching.sort((a, b) => b.openedAt.localeCompare(a.openedAt))
  }

  find(id: string): SearchSubject | undefined {
    return this.#subjects.get(id)
  }

  create(input: CreateSubjectInput): SearchSubject {
    this.#sequence += 1
    const timestamp = new Date().toISOString()

    const subject: SearchSubject = {
      ...input,
      id: `sub_${String(this.#sequence).padStart(2, '0')}`,
      reference: `SK-${2040 + this.#sequence}`,
      status: input.status ?? 'new',
      openedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    this.#subjects.set(subject.id, subject)
    return subject
  }

  update(id: string, patch: UpdateSubjectInput): SearchSubject | undefined {
    const current = this.#subjects.get(id)
    if (!current) return undefined

    const updated: SearchSubject = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    this.#subjects.set(id, updated)
    return updated
  }

  remove(id: string): boolean {
    return this.#subjects.delete(id)
  }
}

/** Single instance shared by the routes for the lifetime of the process. */
export const subjectStore = new SubjectStore(seedSubjects)
