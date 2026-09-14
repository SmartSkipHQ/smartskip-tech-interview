import type { PhoneRecord } from '@smartskip/shared'

/**
 * TODO(candidate): optional, pick this up only if the geo work landed early.
 *
 * In production a carrier lookup tells us whether a line is still worth
 * dialling. Here the vendor fixture leaves `active` as `null` on some numbers,
 * which means "nobody checked" rather than "disconnected" — a distinction the
 * UI currently glosses over and probably should not.
 *
 * You could reach for a real lookup API, or parse and validate the numbers
 * locally with something like `libphonenumber-js` and be honest in the UI about
 * what you do and do not know. The second option is not a cop-out, and arguing
 * for it is a perfectly good answer.
 */
export async function lookupPhone(phone: PhoneRecord): Promise<PhoneRecord> {
  return phone
}
