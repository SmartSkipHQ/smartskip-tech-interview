import type { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ParamsDictionary, Query } from 'express-serve-static-core'

/**
 * Express 4 does not forward rejected promises to the error middleware, so any
 * async handler needs to be wrapped in this. The generics mirror Express's own
 * defaults so the `:id` in a route path still types `req.params`.
 */
export function asyncHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    handler(req, res, next).catch(next)
  }
}
