import moment from 'moment'
import { describe, expect, it } from 'vitest'
import { birthdayFilter } from '../controller'

const testcase: { month: number; date: number; name: string }[] = [
  {
    name: '1',
    month: 7,
    date: 22
  },
  {
    name: '1',
    month: 7,
    date: 23
  },
  {
    name: '1',
    month: 7,
    date: 24
  },
  {
    name: '1',
    month: 7,
    date: 25
  },
  {
    name: '1',
    month: 7,
    date: 26
  },
  {
    name: '1',
    month: 7,
    date: 27
  },
  {
    name: '1',
    month: 7,
    date: 28
  },
  {
    name: '1',
    month: 7,
    date: 31
  },
  {
    name: '1',
    month: 8,
    date: 1
  },
  {
    name: '1',
    month: 8,
    date: 2
  },
  {
    name: '1',
    month: 8,
    date: 3
  },
  {
    name: '1',
    month: 8,
    date: 4
  },
  {
    name: '1',
    month: 12,
    date: 27
  },
  {
    name: '1',
    month: 12,
    date: 28
  },
  {
    name: '1',
    month: 12,
    date: 31
  },
  {
    name: '1',
    month: 1,
    date: 1
  },
  {
    name: '1',
    month: 1,
    date: 2
  },
  {
    name: '1',
    month: 1,
    date: 3
  },
  {
    name: '1',
    month: 1,
    date: 4
  }
]

describe('filter test', () => {
  it('today filter', () => {
    const filter = birthdayFilter(0, 0, moment('2022-07-22'))

    expect(testcase.filter(filter)).toEqual([{ name: '1', month: 7, date: 22 }])
  })

  it('filter in 3 days', () => {
    const filter = birthdayFilter(3, 0, moment('2022-07-22'))

    expect(testcase.filter(filter)).toEqual([
      {
        name: '1',
        month: 7,
        date: 23
      },
      {
        name: '1',
        month: 7,
        date: 24
      }
    ])
  })

  it('filter in 7 days and after 3 days', () => {
    const filter = birthdayFilter(7, 3, moment('2022-07-22'))

    expect(testcase.filter(filter)).toEqual([
      {
        name: '1',
        month: 7,
        date: 25
      },
      {
        name: '1',
        month: 7,
        date: 26
      },
      {
        name: '1',
        month: 7,
        date: 27
      },
      {
        name: '1',
        month: 7,
        date: 28
      }
    ])
  })

  it('bubble up month', () => {
    const filter = birthdayFilter(7, 0, moment('2022-7-27'))

    expect(testcase.filter(filter)).toEqual([
      {
        name: '1',
        month: 7,
        date: 28
      },
      {
        name: '1',
        month: 7,
        date: 31
      },
      {
        name: '1',
        month: 8,
        date: 1
      },
      {
        name: '1',
        month: 8,
        date: 2
      }
    ])
  })

  it('bubble up year', () => {
    const filter = birthdayFilter(7, 0, moment('2022-12-27'))

    expect(testcase.filter(filter)).toEqual([
      {
        name: '1',
        month: 12,
        date: 28
      },
      {
        name: '1',
        month: 12,
        date: 31
      },
      {
        name: '1',
        month: 1,
        date: 1
      },
      {
        name: '1',
        month: 1,
        date: 2
      }
    ])
  })
})
