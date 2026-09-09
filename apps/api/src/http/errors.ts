export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export const notFound = (message: string) => new HttpError(404, message)

export const badRequest = (message: string, details?: unknown) =>
  new HttpError(400, message, details)

export const upstreamFailure = (message: string, details?: unknown) =>
  new HttpError(502, message, details)
