import cors from 'cors'
import express from 'express'
import { insightsRouter } from './routes/insights'
import { jobsRouter } from './routes/jobs'
import { HttpError } from './http/errors'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/jobs', jobsRouter)
  app.use('/api', insightsRouter)

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

      console.error('[api] unhandled error', err)
      res.status(500).json({ error: 'Internal server error' })
    },
  )

  return app
}
