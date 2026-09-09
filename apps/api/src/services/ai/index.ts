import { anthropicGenerator } from './anthropicGenerator'
import { mockGenerator } from './mockGenerator'
import type { BriefingGenerator } from './types'

export type { BriefingContext, BriefingGenerator } from './types'

/** Chosen by AI_PROVIDER, defaulting to the offline implementation. */
export function getBriefingGenerator(): BriefingGenerator {
  return process.env.AI_PROVIDER === 'anthropic' ? anthropicGenerator : mockGenerator
}
