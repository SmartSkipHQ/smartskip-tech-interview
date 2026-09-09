import type { DayBriefing } from '@smartskip/shared'
import type { BriefingContext, BriefingGenerator } from './types'

/**
 * TODO(candidate): the real thing.
 *
 * `@anthropic-ai/sdk` is already installed and `ANTHROPIC_API_KEY` /
 * `ANTHROPIC_MODEL` are read from the environment. Roughly:
 *
 *   import Anthropic from '@anthropic-ai/sdk'
 *   const client = new Anthropic()
 *   const response = await client.messages.create({
 *     model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5',
 *     max_tokens: 1024,
 *     system: '...',
 *     messages: [{ role: 'user', content: '...' }],
 *   })
 *
 * The interesting decisions are not the SDK call:
 *   - how do you get structured output you can trust enough to render?
 *   - what happens when the model returns something that does not parse?
 *   - the model should only flag jobs that exist in the context; how do you
 *     stop it inventing one?
 *   - how would you test this without hitting the API on every run?
 */
export const anthropicGenerator: BriefingGenerator = {
  async generate(_context: BriefingContext): Promise<DayBriefing> {
    throw new Error('anthropicGenerator is not implemented yet')
  },
}
