# SmartSkip technical interview

A small dispatch board for a skip hire depot. It already runs; most of it is not built yet.

We use this repo for the technical part of the interview. You will work in it live with one of
us for about 90 minutes. Nothing here is a trick question and there is no hidden test suite
scoring you — we want to see how you actually work.

**Before the session:** clone the repo, run `npm install`, run `npm run dev`, and confirm you
see jobs in the browser. That's it. Please don't start on the tasks beforehand.

## The scenario

SmartSkip drops skips at customer sites and collects them again. A dispatcher plans one depot's
day: a handful of jobs, each at an address, each in a time slot.

Two things ruin a day. The weather, because a heavy skip on soaked ground sinks and a windy lift
over a fence is dangerous. And the driving, because the jobs were booked by time slot, not by
geography. The app should pull that information in and tell the dispatcher what needs attention,
instead of making them read six forecasts and a map.

## Running it

Node 20 or newer.

```bash
npm install
npm run dev
```

- Web app: http://localhost:5173
- API: http://localhost:3001

`cp .env.example .env` if you want to change anything, but the app boots fine without it.

| Command | What it does |
| --- | --- |
| `npm run dev` | API and web app together, both watching |
| `npm run dev:api` / `npm run dev:web` | One at a time |
| `npm test` | Vitest, currently only in the API |
| `npm run typecheck` | `tsc` and `vue-tsc` |
| `npm run build` | Production build of the web app |

## What's in the box

```
apps/api        Express + TypeScript. In-memory store, seeded with six jobs.
apps/web        Vue 3 + Vite + TypeScript.
packages/shared Types both sides import. Start here to get your bearings.
```

Already working:

- `GET /api/jobs` (optional `?status=`) and `GET /api/jobs/:id`
- The job list in the UI, and a date picker that filters it
- `GET /api/briefing`, backed by a deliberately dumb rule-based generator
- Error handling, an async route wrapper, and three tests on the store

Deliberately not working — every one of these is marked `TODO(candidate)`:

- Creating, updating and deleting jobs, on both sides of the wire
- `src/services/weather.ts` returns zeroes
- `src/services/routing.ts` returns an empty route
- `src/services/ai/anthropicGenerator.ts` throws

## What we'd like you to build

Roughly in this order, though it's your call:

**1. CRUD.** Make jobs creatable, editable and deletable end to end. The store already supports
it; the routes, the client and the UI don't.

**2. Real third-party data.** Replace at least one of the two stubs with a live provider. Both
suggested APIs are free and need no key — the URLs and the pitfalls worth thinking about are in
the comments in each service file.

**3. The AI layer.** Turn the day's jobs, forecasts and route into a briefing a dispatcher would
actually read. `AI_PROVIDER=anthropic` switches to the real implementation; we'll give you a
temporary API key at the start of the session so you never need your own.

If all three land and there's time left, pick whatever you think the app most needs. Showing the
route on a map, surfacing the forecast on each job card, and moving the store behind a real
database are all reasonable answers, and so is something we haven't thought of.

## How we run the session

- Use whatever tools you normally use. Claude, Cursor, Copilot, the docs, Stack Overflow — all
  fine, all expected. We'd genuinely rather watch you drive an AI well than watch you type.
- Talk through what you're doing. Where you decided something could have gone another way, say
  so. Half of what we learn comes from that, not from the diff.
- Commit as you go, in whatever way you normally would.
- Finishing everything is not the bar. We've never had a candidate get through the whole list,
  and the list is long on purpose.

## What we pay attention to

- Whether the code reads like the code already here, and whether someone else could pick it up.
- What you do at the edges: the upstream is down, the model returns nonsense, the user sends a
  malformed body. Not every case needs handling, but we'll ask why you handled the ones you did.
- Whether you check that the thing works, and how.
- What you accept from an AI tool and what you push back on.
- The questions you ask when the brief is vague. It's vague in places on purpose.

Questions before the session? Email whoever set it up with you. Good luck.
