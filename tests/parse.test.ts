import { describe, expect, it } from 'vitest'
import { parseBirthdayData } from '../utils'

describe('parse birthday data', () => {
  it('read multiplier data', () => {
    const dataMessage = `
person1 01-11
person2 02-22
person3 03-33
person4 04-44
person5 05-55
person6 06-66
person7 07-77
    `

    expect(parseBirthdayData(dataMessage, '1234')).toMatchInlineSnapshot(`
      [
        {
          "chatroomId": "1234",
          "date": "11",
          "month": "01",
          "name": "person1",
        },
        {
          "chatroomId": "1234",
          "date": "22",
          "month": "02",
          "name": "person2",
        },
        {
          "chatroomId": "1234",
          "date": "33",
          "month": "03",
          "name": "person3",
        },
        {
          "chatroomId": "1234",
          "date": "44",
          "month": "04",
          "name": "person4",
        },
        {
          "chatroomId": "1234",
          "date": "55",
          "month": "05",
          "name": "person5",
        },
        {
          "chatroomId": "1234",
          "date": "66",
          "month": "06",
          "name": "person6",
        },
        {
          "chatroomId": "1234",
          "date": "77",
          "month": "07",
          "name": "person7",
        },
      ]
    `)
  })
})
