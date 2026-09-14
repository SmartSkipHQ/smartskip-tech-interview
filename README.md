# SmartSkip technical interview

A small app that looks at what you have planned, checks the weather where it happens, and tells
you whether to go ahead. It already runs; most of it is not built yet.

We use this repo for the technical part of the interview. You will work in it live with one of
us for about 90 minutes. Nothing here is a trick question and there is no hidden test suite
scoring you — we want to see how you actually work.

**Before the session:** clone the repo, run `npm install`, run `npm run dev`, and confirm you see
five plans in the browser. That's it. Please don't start on the tasks beforehand.

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
apps/api        Express + TypeScript. In-memory store, seeded with five plans.
apps/web        Vue 3 + Vite + TypeScript.
packages/shared Types both sides import. Start here to get your bearings.
```

The whole domain is three types. A `Plan` is a title, a city and a day. A `Forecast` is the
weather for that city on that day. An `Advice` is a verdict — go, maybe, reschedule — with one
sentence of reasoning.

Already working:

- `GET /api/plans` and `GET /api/plans/:id`
- `GET /api/plans/:id/advice`, which returns the plan, its forecast and the verdict
- The card list in the UI, error handling, an async route wrapper, and tests on the store

Deliberately not working — every one of these is marked `TODO(candidate)`:

- Adding, editing and deleting plans, on both sides of the wire
- `src/services/weather.ts` returns canned numbers instead of calling a weather API
- `src/services/ai/anthropicAdvisor.ts` throws

## What we'd like you to build

Roughly in this order, though it's your call:

**1. CRUD.** Make plans addable, editable and deletable end to end. The store already supports
it; the routes, the client and the UI don't.

**2. Real weather.** Replace the canned forecast with Open-Meteo, which is free and needs no API
key. It's two calls — city name to coordinates, then coordinates to a daily forecast — and both
URLs are written out in the comments in `weather.ts`, along with the pitfalls worth thinking
about.

**3. Better advice.** Open the app and look at the Chicago card: it's an indoor client meeting on
the fourteenth floor, and the app tells you to move it because it's raining. Meanwhile the
barbecue in 38°C heat gets a cheerful "go ahead". That's because the current advisor reads two
numbers and never looks at what the plan actually *is*. Replace it with Claude and fix that.
`AI_PROVIDER=anthropic` switches implementations; we'll give you a temporary API key at the start
of the session so you never need your own.

If all three land and there's time left, pick whatever you think the app most needs. Suggesting a
better day (the `suggestedDate` field is already there and never filled), showing the week around
each plan, and caching the weather so five plans don't mean ten upstream calls are all reasonable
answers, and so is something we haven't thought of.

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
- What you do at the edges: the weather API is down or rate limits you, the model returns
  nonsense, the user types a city that doesn't exist, a plan is three weeks out and has no
  forecast. Not every case needs handling, but we'll ask why you handled the ones you did.
- Whether you check that the thing works, and how.
- What you accept from an AI tool and what you push back on.
- The questions you ask when the brief is vague. It's vague in places on purpose.

Questions before the session? Email whoever set it up with you. Good luck.
