# Working in this repo

Notes for coding agents, and for humans who want the conventions in one place.

## Layout

- `apps/api` — Express 4 + TypeScript, run with `tsx`. Routes in `src/routes`, upstream calls in
  `src/services`, persistence in `src/store`, fixtures in `src/data`.
- `apps/web` — Vue 3 `<script setup>` + Vite. Components in `src/components`, reactive state in
  `src/composables`, the HTTP client in `src/api/client.ts`.
- `packages/shared` — types imported by both as `@smartskip/shared`. Anything that crosses the
  wire belongs here, not duplicated on each side.

## Domain

A `SearchSubject` is a person we are trying to locate. Vendors return `SearchRecord`s about them,
each carrying `PhoneRecord`s and `Relationship`s. Vendors contradict each other, so a
`SearchRecord` is a claim, not a fact. A `Resolution` groups records into `ResolvedIdentity`
clusters with a confidence score and a rationale.

`src/services/vendors.ts` simulates the paid providers. It is the only place that fabricates
data, and it is allowed to be slow and to fail.

## Conventions

- TypeScript is strict, including `noUncheckedIndexedAccess`. Prefer narrowing over `!` and
  `as`.
- No semicolons, single quotes, two-space indent, trailing commas.
- Routes stay thin: validate, call a service or the store, respond. Business logic goes in
  `src/services`.
- Errors thrown as `HttpError` (`src/http/errors.ts`) become the response; anything else is a
  500. Async handlers must be wrapped in `asyncHandler`, since Express 4 swallows rejections.
- A failing vendor is data, not an exception. Keep it in `SourceResult.error` and let the caller
  decide what to show.
- Vue components take props and emit events. Data fetching lives in a composable or in the
  component that owns the state, not deep in the tree.
- Plain CSS in `src/styles.css` with BEM-ish class names. No UI framework.

## Data

Everything in `src/data` is synthetic and must stay that way. Phone numbers use the 555 range.
Never add real consumer data to this repo.

## Checks

`npm run typecheck` and `npm test` should both pass before you call something done. `npm run dev`
runs the API on 3001 and the web app on 5173, which proxies `/api` to the API.

## Comments

Comment the constraint, not the code. `TODO(candidate)` blocks mark the unfinished work and
explain the decisions behind each one — read them before starting, and delete them as you go.
