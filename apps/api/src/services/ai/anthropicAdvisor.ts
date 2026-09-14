import type { Advice } from '@smartskip/shared'
import type { AdviceContext, Advisor } from './types'

/**
 * TODO(candidate): the real thing.
 *
 * `@anthropic-ai/sdk` is installed and `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`
 * are read from the environment. The call itself is about six lines:
 *
 *   import Anthropic from '@anthropic-ai/sdk'
 *   const client = new Anthropic()
 *   const response = await client.messages.create({
 *     model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5',
 *     max_tokens: 512,
 *     system: '...',
 *     messages: [{ role: 'user', content: '...' }],
 *   })
 *
 * The six lines are not what we are looking at. These are:
 *
 *   - The title is the whole point. "Client meeting downtown" in the rain is
 *     fine; "Backyard barbecue" in the rain is not. The mock ignores it, and a
 *     model is good at exactly this kind of judgement.
 *   - You have to render the result. How do you get output shaped like `Advice`
 *     reliably, and what happens on the run where it is not?
 *   - `verdict` has to be one of three values. What stops a model returning
 *     "probably"?
 *   - `suggestedDate` is unused so far. Filling it means giving the model more
 *     than one day of forecast to choose from.
 *   - How would you test this without hitting the API on every run?
 *
 * The reason is read by a person deciding what to do on Saturday, so it should
 * sound like a friend answering, not like a model hedging.
 */
export const anthropicAdvisor: Advisor = {
  async advise(_context: AdviceContext): Promise<Advice> {
    throw new Error('anthropicAdvisor is not implemented yet')
  },
}
