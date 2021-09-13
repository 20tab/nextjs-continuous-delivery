import { like } from '@pact-foundation/pact/src/dsl/matchers'

import { likeToContent } from '@/__tests__/pact/utils'

describe('Pact helpers', () => {
  test('It converts an array of objects from like matchers to actual content', () => {
    const actual = [
      {
        status: 'draft',
        datetimeUpdated: like('2020-12-29T01:00:00+01:00'),
        datetimeReleased: null
      },
      {
        status: 'draft',
        datetimeUpdated: like('2020-11-31T01:00:00+01:00'),
        datetimeReleased: null
      }
    ]

    const expected = [
      {
        status: 'draft',
        datetimeUpdated: '2020-12-29T01:00:00+01:00',
        datetimeReleased: null
      },
      {
        status: 'draft',
        datetimeUpdated: '2020-11-31T01:00:00+01:00',
        datetimeReleased: null
      }
    ]

    expect(likeToContent(actual)).toEqual(expected)
  })
  test('It converts an object from like matchers to actual content', () => {
    const actual = {
      status: 'draft',
      datetimeUpdated: like('2020-12-29T01:00:00+01:00'),
      datetimeReleased: null
    }

    const expected = {
      status: 'draft',
      datetimeUpdated: '2020-12-29T01:00:00+01:00',
      datetimeReleased: null
    }

    expect(likeToContent(actual)).toEqual(expected)
  })

  test('It converts nested objects from like matchers to actual content', () => {
    const actual = {
      status: 'draft',
      datetimeUpdated: like('2020-12-29T01:00:00+01:00'),
      nested: {
        id: like('9dac1a7f-d0b4-4952-b74e-2fea52701113')
      }
    }

    const expected = {
      status: 'draft',
      datetimeUpdated: '2020-12-29T01:00:00+01:00',
      nested: {
        id: '9dac1a7f-d0b4-4952-b74e-2fea52701113'
      }
    }

    expect(likeToContent(actual)).toEqual(expected)
  })
})
