import type { CreatePlanInput, Plan, PlanAdvice } from '@smartskip/shared'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Vite proxies /api to the Express server, so relative paths are enough. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new ApiError(response.status, body?.error ?? response.statusText)
  }

  return response.json() as Promise<T>
}

export const api = {
  listPlans(): Promise<Plan[]> {
    return request<Plan[]>('/plans')
  },

  getPlan(id: string): Promise<Plan> {
    return request<Plan>(`/plans/${id}`)
  },

  /** TODO(candidate): POST /plans */
  createPlan(_input: CreatePlanInput): Promise<Plan> {
    return Promise.reject(new Error('createPlan is not implemented yet'))
  },

  /** `provider` overrides the server default, for comparing implementations. */
  getAdvice(planId: string, provider?: 'mock' | 'anthropic'): Promise<PlanAdvice> {
    const query = provider ? `?provider=${provider}` : ''
    return request<PlanAdvice>(`/plans/${planId}/advice${query}`)
  },
}
