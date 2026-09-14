import type {
  CreatePlanInput,
  Plan,
  PlanAdvice,
  UpdatePlanInput,
} from '@smartskip/shared'

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

  /** TODO(candidate): PATCH /plans/:id */
  updatePlan(_id: string, _patch: UpdatePlanInput): Promise<Plan> {
    return Promise.reject(new Error('updatePlan is not implemented yet'))
  },

  /** TODO(candidate): DELETE /plans/:id */
  deletePlan(_id: string): Promise<void> {
    return Promise.reject(new Error('deletePlan is not implemented yet'))
  },

  getAdvice(planId: string): Promise<PlanAdvice> {
    return request<PlanAdvice>(`/plans/${planId}/advice`)
  },
}
