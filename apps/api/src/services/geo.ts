import type { SearchRecord, SearchSubject } from '@smartskip/shared'

/**
 * TODO(candidate): put the records on the map.
 *
 * Fill in `coordinates` for every record that has an address, and
 * `distanceFromLastKnownKm` relative to the subject's last known address. That
 * distance is real signal: a match three states away is usually a namesake, and
 * a match around the corner from a known relative usually is not.
 *
 * Two free providers, neither needs an API key:
 *
 *   Nominatim (full address -> coordinates)
 *     https://nominatim.openstreetmap.org/search?format=json&limit=1
 *       &street=822+E+Broadway+Blvd&city=Tucson&state=AZ&postalcode=85719
 *     Read their usage policy before you call it. There is a requirement in
 *     there that will make your requests fail until you meet it.
 *
 *   Zippopotam (US ZIP -> city, state, coordinates)
 *     https://api.zippopotam.us/us/85719
 *     Cruder, but instant and much friendlier about rate limits.
 *
 * Worth thinking about, roughly in order:
 *   - four records means four lookups; the same ZIP appears twice already
 *   - the provider will rate limit you long before the UI stops being usable
 *   - a geocoder that is down should degrade the result, not break the search
 *   - straight-line distance is a haversine, not a subtraction
 */
export async function enrichWithLocation(
  _subject: SearchSubject,
  records: SearchRecord[],
): Promise<SearchRecord[]> {
  return records
}
