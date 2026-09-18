import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { createApp } from './app'

// npm runs this with the workspace as the working directory, so a plain
// `dotenv/config` would only ever find apps/api/.env. The README tells you to
// put one at the repo root, so look there too. First file wins.
const here = path.dirname(fileURLToPath(import.meta.url))
config({ path: [path.resolve(here, '../.env'), path.resolve(here, '../../../.env')] })

const port = Number(process.env.PORT ?? 3001)

createApp().listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`)
})
