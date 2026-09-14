import type { RecordSource, SearchRecord } from '@smartskip/shared'

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

/**
 * What the vendors "return". Synthetic, and deliberately contradictory: the
 * disagreements below are the problem the exercise asks you to solve.
 *
 * Subject sub_01 is the interesting one. Three of its four records describe one
 * man who moved from Phoenix to Tucson; the fourth is a different Marcus Webb
 * in Texas who happens to share the name.
 */
export const vendorRecords: SearchRecord[] = [
  {
    id: 'rec_01',
    subjectId: 'sub_01',
    source: 'idi',
    fullName: 'Marcus A. Webb',
    age: 41,
    address: {
      line1: '1140 N 3rd St',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85004',
    },
    phones: [
      {
        number: '+1 602 555 0147',
        lineType: 'landline',
        carrier: 'Desert Bell',
        active: false,
        lastSeen: daysAgo(610),
      },
    ],
    relatives: [
      { fullName: 'Denise Webb', relation: 'spouse', age: 39 },
      { fullName: 'Harold Webb', relation: 'parent', age: 68 },
    ],
    reportedAt: daysAgo(540),
  },
  {
    id: 'rec_02',
    subjectId: 'sub_01',
    source: 'public_records',
    fullName: 'Marcus Webb',
    age: 41,
    address: {
      line1: '822 E Broadway Blvd',
      city: 'Tucson',
      state: 'AZ',
      postalCode: '85719',
    },
    phones: [],
    relatives: [{ fullName: 'Denise Webb', relation: 'spouse', age: 39 }],
    reportedAt: daysAgo(130),
  },
  {
    id: 'rec_03',
    subjectId: 'sub_01',
    source: 'telco',
    fullName: 'M. Webb',
    address: {
      line1: '822 E Broadway Blvd',
      city: 'Tucson',
      state: 'AZ',
      postalCode: '85719',
    },
    phones: [
      {
        number: '+1 520 555 0188',
        lineType: 'mobile',
        carrier: 'Sunbelt Mobile',
        active: true,
        lastSeen: daysAgo(15),
      },
    ],
    relatives: [],
    reportedAt: daysAgo(12),
  },
  {
    id: 'rec_04',
    subjectId: 'sub_01',
    source: 'idi',
    fullName: 'Marcus Webb',
    age: 63,
    address: {
      line1: '4410 Lamar Ave',
      city: 'Dallas',
      state: 'TX',
      postalCode: '75206',
    },
    phones: [
      {
        number: '+1 214 555 0133',
        lineType: 'landline',
        carrier: 'Lone Star Telecom',
        active: true,
        lastSeen: daysAgo(70),
      },
    ],
    relatives: [{ fullName: 'Gloria Webb', relation: 'spouse', age: 61 }],
    reportedAt: daysAgo(95),
  },
  {
    id: 'rec_05',
    subjectId: 'sub_02',
    source: 'idi',
    fullName: 'Alicia Ferraro',
    age: 34,
    phones: [
      {
        number: '+1 480 555 0102',
        lineType: 'mobile',
        active: null,
      },
    ],
    relatives: [],
    reportedAt: daysAgo(400),
  },
  {
    id: 'rec_06',
    subjectId: 'sub_03',
    source: 'public_records',
    fullName: 'Darnell Price',
    age: 52,
    address: {
      line1: '214 S Craycroft Rd',
      city: 'Tucson',
      state: 'AZ',
      postalCode: '85711',
    },
    phones: [],
    relatives: [{ fullName: 'Yvonne Price', relation: 'sibling', age: 49 }],
    reportedAt: daysAgo(40),
  },
  {
    id: 'rec_07',
    subjectId: 'sub_03',
    source: 'telco',
    fullName: 'Darnell Price',
    address: {
      line1: '214 S Craycroft Rd',
      city: 'Tucson',
      state: 'AZ',
      postalCode: '85711',
    },
    phones: [
      {
        number: '+1 520 555 0170',
        lineType: 'mobile',
        carrier: 'Sunbelt Mobile',
        active: true,
        lastSeen: daysAgo(9),
      },
    ],
    relatives: [],
    reportedAt: daysAgo(8),
  },
]

/**
 * Sources that always fail for a given subject. Vendors go down, and a search
 * that returns nothing because one of three providers timed out is a bug.
 * Deterministic on purpose: you can reproduce it.
 */
export const forcedFailures: Partial<Record<RecordSource, string[]>> = {
  public_records: ['sub_02'],
}
