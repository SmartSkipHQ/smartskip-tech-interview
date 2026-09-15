interface Entry<T> {
  value: T
  expiresAt: number
}

/**
 * A map with expiry. Enough to stop us geocoding the same city on every page
 * load, and no more than that: it lives in one process and never evicts
 * anything it has not been asked for again.
 */
export class TtlCache<T> {
  #entries = new Map<string, Entry<T>>()

  constructor(private readonly ttlMs: number) {}

  get(key: string): T | undefined {
    const entry = this.#entries.get(key)
    if (!entry) return undefined

    if (entry.expiresAt <= Date.now()) {
      this.#entries.delete(key)
      return undefined
    }

    return entry.value
  }

  set(key: string, value: T): void {
    this.#entries.set(key, { value, expiresAt: Date.now() + this.ttlMs })
  }

  /** Read through, caching only what the loader resolves. */
  async wrap(key: string, load: () => Promise<T>): Promise<T> {
    const hit = this.get(key)
    if (hit !== undefined) return hit

    const value = await load()
    this.set(key, value)
    return value
  }

  clear(): void {
    this.#entries.clear()
  }
}
