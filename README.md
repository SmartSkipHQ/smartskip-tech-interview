# SmartSkip technical interview

A small app that looks at what you have planned, checks the weather where it happens, and tells
you whether to go ahead. It runs, it talks to a real weather API, and the part that decides is
deliberately bad.

We use this repo for the technical part of the interview. You will work in it live with one of
us for about 90 minutes. Nothing here is a trick question and there is no hidden test suite
scoring you — we want to see how you understand, improve and take ownership of a system you did
not write.

**Before the session:** clone the repo, run `npm install`, run `npm run dev`, and confirm you see
seven plans in the browser. That's it. Please don't start on the tasks beforehand.

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
apps/api        Express + TypeScript. In-memory store, seeded with seven plans.
apps/web        Vue 3 + Vite + TypeScript.
packages/shared Types both sides import. Start here to get your bearings.
```

The whole domain is three types. A `Plan` is a title, a city and a day. A `Forecast` is the
weather for that city on that day. An `Advice` is a verdict — go, maybe, reschedule — with one
sentence of reasoning.

Working, and worth reading before you change anything:

- `GET /api/plans`, `GET /api/plans/:id`
- `GET /api/plans/:id/advice`, which returns the plan, its forecast and the verdict in one call
- A real Open-Meteo integration in `src/services/weather/`, with caching, timeouts, and a
  fixture mode for when you want the same numbers twice
- The card list in the UI, error handling, an async route wrapper, and tests

Two of the seeded plans have no forecast, and that is the point: "Rooftop drinks" is in a Chicago
neighbourhood no geocoder will place, and the marathon is past the sixteen days any forecast
covers. Neither is a bug.

## What we'd like you to build

**1. One write operation, end to end.** `POST /api/plans` returns 501 and the form in the UI is a
placeholder. Make adding a plan work, all the way through. The store already supports it, so the
interesting part is deciding what a valid plan even is — an empty title, a date in the past, a
city that doesn't exist.

Keep this tight. It's here to get you into the codebase, not to prove you can write a form.

**2. Make the advice good.** This is most of the session.

Open the app. The advisor in `src/services/ai/mockAdvisor.ts` reads two numbers and never looks
at what the plan actually *is*, so it will tell you to move an indoor client meeting because it's
raining, and wave through a barbecue in punishing heat. Replace it with Claude in
`anthropicAdvisor.ts` and fix that.

Getting a response back from the model is not the finish line. We're looking for:

- **It's actually better.** `?provider=mock` and `?provider=anthropic` on the advice endpoint run
  both on the same plan, so you can show the difference rather than assert it.
- **The output is trustworthy.** `verdict` has to be one of three values and you have to render
  it. What stops the model returning `"probably"`, and what happens on the run where it does?
- **You know what breaks.** The weather provider can time out, the model can fail, a plan can
  have no forecast at all. Some of that is handled today and some isn't. Be able to say which.

If there's time left, `suggestedDate` exists on `Advice` and is never filled, which means giving
the model more than one day to choose from.

## How we run the session

- Use whatever tools you normally use. Claude, Cursor, Copilot, the docs, Stack Overflow — all
  fine, all expected. We'd genuinely rather watch you drive an AI well than watch you type.
- Talk through what you're doing. Where you decided something could have gone another way, say
  so. Half of what we learn comes from that, not from the diff.
- Expect questions about the code you just changed: how it would work against a real database,
  what happens under concurrent writes, how you'd know it works.
- Commit as you go, in whatever way you normally would.
- Finishing everything is not the bar.

## What we pay attention to

- **Ownership.** Do you understand the code you're changing, and does the app genuinely do more
  at the end than at the start.
- **Architecture and data.** The store is a `Map`. Be ready to talk about what changes when it
  isn't.
- **Verification.** How you convince yourself, and us, that it works.
- **AI judgement.** What you accept from a model, what you push back on, and what you do when it
  hands you something wrong.

Questions before the session? Email whoever set it up with you. Good luck.
