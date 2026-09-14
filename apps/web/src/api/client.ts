import type {
  CreateSubjectInput,
  Resolution,
  SearchSubject,
  SourceResult,
  SubjectStatus,
  UpdateSubjectInput,
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
  listSubjects(params: { status?: SubjectStatus } = {}): Promise<SearchSubject[]> {
    const query = params.status ? `?status=${params.status}` : ''
    return request<SearchSubject[]>(`/subjects${query}`)
  },

  getSubject(id: string): Promise<SearchSubject> {
    return request<SearchSubject>(`/subjects/${id}`)
  },

  /** TODO(candidate): POST /subjects */
  createSubject(_input: CreateSubjectInput): Promise<SearchSubject> {
    return Promise.reject(new Error('createSubject is not implemented yet'))
  },

  /** TODO(candidate): PATCH /subjects/:id */
  updateSubject(_id: string, _patch: UpdateSubjectInput): Promise<SearchSubject> {
    return Promise.reject(new Error('updateSubject is not implemented yet'))
  },

  /** TODO(candidate): DELETE /subjects/:id */
  deleteSubject(_id: string): Promise<void> {
    return Promise.reject(new Error('deleteSubject is not implemented yet'))
  },

  getRecords(subjectId: string): Promise<SourceResult[]> {
    return request<SourceResult[]>(`/subjects/${subjectId}/records`)
  },

  getResolution(subjectId: string): Promise<Resolution> {
    return request<Resolution>(`/subjects/${subjectId}/resolution`)
  },
}
