import { ref, shallowRef } from 'vue'
import type { Job } from '@smartskip/shared'
import { api } from '@/api/client'

/**
 * Loads the job list once and exposes a `refresh` for callers that change it.
 * Small on purpose: extend it as the app grows.
 */
export function useJobs() {
  const jobs = shallowRef<Job[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      jobs.value = await api.listJobs()
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Failed to load jobs'
    } finally {
      loading.value = false
    }
  }

  return { jobs, loading, error, refresh }
}
