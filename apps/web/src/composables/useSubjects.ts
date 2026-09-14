import { ref, shallowRef } from 'vue'
import type { SearchSubject } from '@smartskip/shared'
import { api } from '@/api/client'

/**
 * Loads the case list once and exposes a `refresh` for callers that change it.
 * Small on purpose: extend it as the app grows.
 */
export function useSubjects() {
  const subjects = shallowRef<SearchSubject[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      subjects.value = await api.listSubjects()
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Failed to load cases'
    } finally {
      loading.value = false
    }
  }

  return { subjects, loading, error, refresh }
}
