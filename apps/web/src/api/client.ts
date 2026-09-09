import type {
  CreateJobInput,
  DayBriefing,
  Job,
  JobForecast,
  JobStatus,
  RoutePlan,
  UpdateJobInput,
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
  listJobs(params: { status?: JobStatus } = {}): Promise<Job[]> {
    const query = params.status ? `?status=${params.status}` : ''
    return request<Job[]>(`/jobs${query}`)
  },

  getJob(id: string): Promise<Job> {
    return request<Job>(`/jobs/${id}`)
  },

  /** TODO(candidate): POST /jobs */
  createJob(_input: CreateJobInput): Promise<Job> {
    return Promise.reject(new Error('createJob is not implemented yet'))
  },

  /** TODO(candidate): PATCH /jobs/:id */
  updateJob(_id: string, _patch: UpdateJobInput): Promise<Job> {
    return Promise.reject(new Error('updateJob is not implemented yet'))
  },

  /** TODO(candidate): DELETE /jobs/:id */
  deleteJob(_id: string): Promise<void> {
    return Promise.reject(new Error('deleteJob is not implemented yet'))
  },

  getForecast(jobId: string): Promise<JobForecast> {
    return request<JobForecast>(`/jobs/${jobId}/forecast`)
  },

  getRoute(date: string): Promise<RoutePlan> {
    return request<RoutePlan>(`/route?date=${date}`)
  },

  getBriefing(date: string): Promise<DayBriefing> {
    return request<DayBriefing>(`/briefing?date=${date}`)
  },
}
