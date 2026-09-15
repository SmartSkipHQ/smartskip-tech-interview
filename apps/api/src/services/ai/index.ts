import { anthropicAdvisor } from './anthropicAdvisor'
import { mockAdvisor } from './mockAdvisor'
import type { Advisor } from './types'

export type { AdviceContext, Advisor } from './types'

export type AdvisorName = 'mock' | 'anthropic'

export function isAdvisorName(value: unknown): value is AdvisorName {
  return value === 'mock' || value === 'anthropic'
}

/**
 * `AI_PROVIDER` picks the default. The override exists so the two can be put
 * side by side on the same plan, which is how you show the advice got better
 * rather than asserting it.
 */
export function getAdvisor(override?: AdvisorName): Advisor {
  const name = override ?? (process.env.AI_PROVIDER === 'anthropic' ? 'anthropic' : 'mock')
  return name === 'anthropic' ? anthropicAdvisor : mockAdvisor
}
