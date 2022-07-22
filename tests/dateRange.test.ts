import moment from 'moment'
import { describe, expect, it } from 'vitest'
import { birthdayAlertRange } from '../controller'

describe('date calculation', () => {
  it('today', () => {
    const today = moment('2022-07-22')
    expect(birthdayAlertRange(0, 0, today)).toEqual([
      [7, 22],
      [7, 23]
    ])
  })

  it('in three days', () => {
    const today = moment('2022-07-22')
    expect(birthdayAlertRange(3, 0, today)).toEqual([
      [7, 23],
      [7, 26]
    ])
  })

  it('3 days after and in 7 days', () => {
    const today = moment('2022-07-22')
    expect(birthdayAlertRange(7, 3, today)).toEqual([
      [7, 26],
      [7, 30]
    ])
  })

  it('bubble up month', () => {
    const today = moment('2022-7-27')
    expect(birthdayAlertRange(7, 3, today)).toEqual([
      [7, 31],
      [8, 4]
    ])
  })

  it('bubble up year', () => {
    const today = moment('2022-12-27')
    expect(birthdayAlertRange(7, 3, today)).toEqual([
      [12, 31],
      [1, 4]
    ])
  })
})
