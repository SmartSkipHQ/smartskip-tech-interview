import { anthropicResolver } from './anthropicResolver'
import { mockResolver } from './mockResolver'
import type { IdentityResolver } from './types'

export type { IdentityResolver, ResolutionContext } from './types'

/** Chosen by AI_PROVIDER, defaulting to the offline implementation. */
export function getIdentityResolver(): IdentityResolver {
  return process.env.AI_PROVIDER === 'anthropic' ? anthropicResolver : mockResolver
}
