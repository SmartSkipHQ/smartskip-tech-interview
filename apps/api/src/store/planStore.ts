import type { CreatePlanInput, Plan, UpdatePlanInput } from '@smartskip/shared'
import { seedPlans } from '../data/plans'

/**
 * In-memory persistence. Deliberately simple: swapping this for a real database
 * should not require touching the routes.
 */
export class PlanStore {
  #plans = new Map<string, Plan>()
  #sequence = 0

  constructor(initial: Plan[] = []) {
    this.reset(initial)
  }

  reset(initial: Plan[] = []): void {
    this.#plans = new Map(initial.map((plan) => [plan.id, structuredClone(plan)]))
    this.#sequence = initial.length
  }

  /** Soonest first, which is the order you care about. */
  list(): Plan[] {
    return [...this.#plans.values()].sort((a, b) => a.date.localeCompare(b.date))
  }

  find(id: string): Plan | undefined {
    return this.#plans.get(id)
  }

  create(input: CreatePlanInput): Plan {
    this.#sequence += 1
    const timestamp = new Date().toISOString()

    const plan: Plan = {
      ...input,
      id: `plan_${String(this.#sequence).padStart(2, '0')}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    this.#plans.set(plan.id, plan)
    return plan
  }

  update(id: string, patch: UpdatePlanInput): Plan | undefined {
    const current = this.#plans.get(id)
    if (!current) return undefined

    const updated: Plan = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }

    this.#plans.set(id, updated)
    return updated
  }

  remove(id: string): boolean {
    return this.#plans.delete(id)
  }
}

/** Single instance shared by the routes for the lifetime of the process. */
export const planStore = new PlanStore(seedPlans)
