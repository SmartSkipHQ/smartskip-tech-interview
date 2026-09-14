import { ref, shallowRef } from 'vue'
import type { Plan } from '@smartskip/shared'
import { api } from '@/api/client'

/**
 * Loads the plan list and exposes a `refresh` for callers that change it.
 * Small on purpose: extend it as the app grows.
 */
export function usePlans() {
  const plans = shallowRef<Plan[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refresh(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      plans.value = await api.listPlans()
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Failed to load plans'
    } finally {
      loading.value = false
    }
  }

  return { plans, loading, error, refresh }
}
