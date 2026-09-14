import { anthropicAdvisor } from './anthropicAdvisor'
import { mockAdvisor } from './mockAdvisor'
import type { Advisor } from './types'

export type { AdviceContext, Advisor } from './types'

/** Chosen by AI_PROVIDER, defaulting to the offline implementation. */
export function getAdvisor(): Advisor {
  return process.env.AI_PROVIDER === 'anthropic' ? anthropicAdvisor : mockAdvisor
}
