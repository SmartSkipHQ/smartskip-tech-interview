# SmartSkip technical interview

A stripped-down skip trace tool. It already runs; most of it is not built yet.

We use this repo for the technical part of the interview. You will work in it live with one of
us for about 90 minutes. Nothing here is a trick question and there is no hidden test suite
scoring you — we want to see how you actually work.

**Before the session:** clone the repo, run `npm install`, run `npm run dev`, and confirm you can
see the Marcus Webb case in the browser. That's it. Please don't start on the tasks beforehand.

## The problem

Skip tracing is finding someone who stopped being findable. You start with a name and a phone
number that no longer works, and you buy data about them from several vendors.

The vendors disagree. Open the app and look at the Marcus Webb case: one source has him in
Phoenix on a landline that's been dead for two years, another has him in Tucson, a third has an
active mobile in Tucson under the name "M. Webb", and a fourth has a Marcus Webb in Dallas who is
twenty-two years older and married to someone else. Three of those are one man who moved. One is
a stranger who happens to share a name.

Sorting that out is the job. Today the app does it by grouping on surname, which is exactly as
bad as it sounds.

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
apps/api        Express + TypeScript. In-memory store, seeded with four cases.
apps/web        Vue 3 + Vite + TypeScript.
packages/shared Types both sides import. Start here to get your bearings.
```

The domain is four types. A `SearchSubject` is the person we're looking for. A `SearchRecord` is
one candidate match as a single vendor reported it, carrying `PhoneRecord`s and `Relationship`s.
A `Resolution` is what we think it all adds up to.

Already working:

- `GET /api/subjects` (optional `?status=`) and `GET /api/subjects/:id`
- `GET /api/subjects/:id/records`, the raw vendor output including per-source failures
- `GET /api/subjects/:id/resolution`, backed by a deliberately naive rule-based resolver
- The three-column UI, error handling, an async route wrapper, and tests on the store

`src/services/vendors.ts` stands in for the paid providers we buy from. We can't hand out live
vendor credentials, so it reads a fixture, takes a realistic moment to answer, and fails for one
subject on purpose. Treat it as a network call you don't control.

Deliberately not working — every one of these is marked `TODO(candidate)`:

- Creating, updating and deleting cases, on both sides of the wire
- `src/services/geo.ts` returns the records untouched
- `src/services/phoneLookup.ts` does nothing (optional, only if you have time)
- `src/services/ai/anthropicResolver.ts` throws

## What we'd like you to build

Roughly in this order, though it's your call:

**1. CRUD.** Make cases openable, editable and deletable end to end. The store already supports
it; the routes, the client and the UI don't.

**2. Put the records on a map.** Geocode the addresses the vendors returned and work out how far
each one is from the subject's last known address. That distance is real signal — a match three
states away is usually a namesake. Two free providers that need no API key are named in the
comments in `geo.ts`, along with the pitfalls worth thinking about. One of them has a usage
requirement that will make your requests fail until you find it.

**3. Resolve the identity properly.** Replace the surname-matching resolver with Claude, and get
it to split the Dallas namesake out, score its confidence honestly, and explain itself in a
paragraph an investigator would act on. `AI_PROVIDER=anthropic` switches implementations; we'll
give you a temporary API key at the start of the session so you never need your own.

If all three land and there's time left, pick whatever you think the tool most needs. Surfacing
the relatives as a graph, letting the user confirm or reject a match, caching vendor calls and
moving the store behind a real database are all reasonable answers, and so is something we
haven't thought of.

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
- What you do at the edges: a vendor is down, the geocoder rate limits you, the model returns
  nonsense, the user sends a malformed body. Not every case needs handling, but we'll ask why you
  handled the ones you did.
- Whether you check that the thing works, and how.
- What you accept from an AI tool and what you push back on.
- The questions you ask when the brief is vague. It's vague in places on purpose.

## One house rule

Every name, number and address in this repo is invented, and the phone numbers use the 555 range
reserved for fiction. Don't put real people's data into it, not even your own.

Questions before the session? Email whoever set it up with you. Good luck.
