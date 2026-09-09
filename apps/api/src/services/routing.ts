import type { Job, RoutePlan } from '@smartskip/shared'
import { DEPOT } from '@smartskip/shared'

/**
 * TODO(candidate): turn a list of jobs into a driveable round trip.
 *
 * The public OSRM demo server needs no API key and speaks `lon,lat`:
 *
 *   https://router.project-osrm.org/trip/v1/driving/
 *     -2.2426,53.4808;-2.2496,53.4794;-2.2549,53.4652
 *     ?source=first&roundtrip=true
 *
 * `/trip` also reorders the stops for you, which is a reasonable answer to
 * "in what order should the driver visit these?". `/route` keeps your order if
 * you would rather sequence them yourself.
 *
 * Start and finish at DEPOT. Distances come back in metres, durations in
 * seconds. Mind the rate limit on the demo server: it is fine for a handful of
 * calls, not for one per keystroke.
 */
export async function planRoute(jobs: Job[]): Promise<RoutePlan> {
  void DEPOT

  return {
    order: jobs.map((job) => job.id),
    legs: [],
    totalDistanceKm: 0,
    totalDurationMin: 0,
  }
}
