import type { SearchSubject } from '@smartskip/shared'

/** ISO timestamp `days` days before now. */
function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const now = new Date().toISOString()

/**
 * Synthetic cases. Every name, number and address here is made up; phone
 * numbers use the 555 range reserved for fiction.
 */
export const seedSubjects: SearchSubject[] = [
  {
    id: 'sub_01',
    reference: 'SK-2041',
    fullName: 'Marcus Webb',
    knownPhone: '+1 602 555 0147',
    lastKnownAddress: {
      line1: '1140 N 3rd St',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85004',
    },
    status: 'searching',
    openedAt: daysAgo(6),
    notes: 'Client says mail has been returned since the spring.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sub_02',
    reference: 'SK-2042',
    fullName: 'Alicia Ferraro',
    knownPhone: '+1 480 555 0102',
    lastKnownAddress: {
      line1: '67 W Main St',
      city: 'Mesa',
      state: 'AZ',
      postalCode: '85201',
    },
    status: 'new',
    openedAt: daysAgo(1),
    notes: 'Thin file. Nothing but the one number.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sub_03',
    reference: 'SK-2039',
    fullName: 'Darnell Price',
    knownPhone: '+1 520 555 0170',
    lastKnownAddress: {
      line1: '905 E Speedway Blvd',
      city: 'Tucson',
      state: 'AZ',
      postalCode: '85719',
    },
    status: 'resolved',
    openedAt: daysAgo(21),
    notes: 'Located at the sister\u2019s address, confirmed by phone.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sub_04',
    reference: 'SK-2035',
    fullName: 'Ruth Okonkwo',
    lastKnownAddress: {
      line1: '3120 W Indian School Rd',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85017',
    },
    status: 'cold',
    openedAt: daysAgo(58),
    notes: 'No hits in two months. Revisit if the client sends a new number.',
    createdAt: now,
    updatedAt: now,
  },
]
