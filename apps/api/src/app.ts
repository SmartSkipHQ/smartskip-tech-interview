import cors from 'cors'
import express from 'express'
import { plansRouter } from './routes/plans'
import { HttpError } from './http/errors'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/plans', plansRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message, details: err.details })
        return
      }

      // body-parser rejects malformed JSON with a 400 it is happy to show the
      // client. Without this it would surface as a 500 and send whoever sent
      // the bad body looking for a server bug.
      if (isExposedHttpError(err)) {
        res.status(err.statusCode).json({ error: err.message })
        return
      }

      console.error('[api] unhandled error', err)
      res.status(500).json({ error: 'Internal server error' })
    },
  )

  return app
}

/** The shape `http-errors` attaches, used by body-parser and friends. */
function isExposedHttpError(err: unknown): err is { statusCode: number; message: string } {
  if (typeof err !== 'object' || err === null) return false

  const candidate = err as { statusCode?: unknown; expose?: unknown }
  return candidate.expose === true && typeof candidate.statusCode === 'number'
}
