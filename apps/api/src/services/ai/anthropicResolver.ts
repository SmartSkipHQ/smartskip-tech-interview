import type { Resolution } from '@smartskip/shared'
import type { IdentityResolver, ResolutionContext } from './types'

/**
 * TODO(candidate): the real thing, and the most interesting part of the day.
 *
 * `@anthropic-ai/sdk` is installed and `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`
 * are read from the environment. The call itself is about six lines:
 *
 *   import Anthropic from '@anthropic-ai/sdk'
 *   const client = new Anthropic()
 *   const response = await client.messages.create({
 *     model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5',
 *     max_tokens: 2048,
 *     system: '...',
 *     messages: [{ role: 'user', content: '...' }],
 *   })
 *
 * The six lines are not what we are looking at. These are:
 *
 *   - Structure. You have to render this. How do you get output shaped like
 *     `Resolution` reliably, and what happens on the run where it is not?
 *   - Grounding. Every id in `recordIds` must be a record that exists. A model
 *     that invents `rec_99` has just invented a person.
 *   - Honesty. Confidence should drop when the sources disagree or when a
 *     vendor failed. `context.sources` carries those errors; the mock ignores
 *     them entirely.
 *   - Namesakes. On sub_01 the mock merges two different men because they share
 *     a surname. Splitting them, and saying why, is the bar.
 *   - Testing. How would you cover this without hitting the API every run?
 *
 * The rationale is read by a human who will act on it, so it should read like
 * something a colleague wrote, not like a model hedging.
 */
export const anthropicResolver: IdentityResolver = {
  async resolve(_context: ResolutionContext): Promise<Resolution> {
    throw new Error('anthropicResolver is not implemented yet')
  },
}
