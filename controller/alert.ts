import { PrismaClient } from '@prisma/client'
import moment, { Moment } from 'moment'
import { BirthdayCreateInput } from '../types'

type BirthdayEl = Pick<BirthdayCreateInput, 'name' | 'month' | 'date'>
type Range = [[number, number], [number, number]]

export async function alert(client: PrismaClient, chatroomId: string) {
  const allBirthdayData = (await client.birthday.findMany({
    where: {
      chatroomId
    }
  })) as BirthdayEl[]

  const { name: title } = await client.chatroom.findUnique({
    where: {
      id: chatroomId
    }
  })

  const birthdayToday = allBirthdayData.filter(birthdayFilter())
  const birthdayIn3days = allBirthdayData.filter(birthdayFilter(3))
  const birthdayIn7days = allBirthdayData.filter(birthdayFilter(7, 3))

  let todayMsg = ''
  let threeDayMsg = ''
  let sevenDayMsg = ''

  if (birthdayToday.length > 0) {
    todayMsg =
      '\n🎉 今天生日的有：\n' +
      `${birthdayToday.map((people) => people.name).join(', ')}\n` +
      `快去给ta${birthdayToday.length > 1 ? '们' : ''}发祝福吧`
  }

  if (birthdayIn3days.length > 0) {
    threeDayMsg =
      '\n🎉 三天内生日的有：\n' +
      `${birthdayIn3days
        .map(
          ({ month, date, name }) =>
            `${name} ${formatTime(month, date)[0]} ${
              formatTime(month, date)[1]
            }`
        )
        .join('\n')}\n` +
      `记得给ta${birthdayIn3days.length > 1 ? '们' : ''}发祝福哦`
  }

  if (birthdayIn7days.length > 0) {
    sevenDayMsg =
      '\n🎉 七天内生日的有：\n' +
      `${birthdayIn7days
        .map(
          ({ month, date, name }) =>
            `${name} ${formatTime(month, date)[0]} ${
              formatTime(month, date)[1]
            }`
        )
        .join('\n')}\n` +
      '到时候别忘了哦'
  }

  if (
    [birthdayToday, birthdayIn3days, birthdayIn7days]
      .map((arr) => arr.length)
      .every((length) => length === 0)
  ) {
    return '最近没有生日的人:)'
  }

  return `${title}：${todayMsg}${threeDayMsg}${sevenDayMsg}`
}

export async function alertAllChatroom(client: PrismaClient) {
  const allEnabledChatroom = await client.chatroom.findMany({
    where: {
      isEnabled: true
    }
  })

  const result: [string, boolean, string][] = []
  for await (const chatroom of allEnabledChatroom) {
    result.push([
      chatroom.id,
      chatroom.isGroup,
      await alert(client, chatroom.id)
    ])
  }

  return result
}

function formatTime(month: number, date: number) {
  const dateStr = date < 10 ? `0${date}` : `${date}`
  const today = moment()

  const isBirthdayNotPast = today.isBefore(
    moment()
      .year(today.year())
      .month(month - 1)
      .date(date),
    'day'
  )
  const birthdayYear = today.year() + (isBirthdayNotPast ? 0 : 1)
  const nextBirthday = moment()
    .year(birthdayYear)
    .month(month - 1)
    .date(date)

  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][
    nextBirthday.day()
  ]
  const isNextWeek =
    today.day() < nextBirthday.day() || nextBirthday.day() !== 0

  return [`${month}月${dateStr}日`, `${isNextWeek ? '下' : ''}周${dayOfWeek}`]
}

export function birthdayFilter(
  end: number = 0,
  start: number = 0,
  today: Moment = moment()
) {
  return (el: BirthdayEl) => {
    if (end === 0) {
      return today.month() + 1 === el.month && today.date() === el.date
    } else {
      const isBirthdayNotPast = today.isBefore(
        moment()
          .year(today.year())
          .month(el.month - 1)
          .date(el.date),
        'day'
      )
      const birthdayYear = today.year() + (isBirthdayNotPast ? 0 : 1)

      return moment()
        .year(birthdayYear)
        .month(el.month - 1)
        .date(el.date)
        .isBetween(
          moment(today).add(start, 'd'),
          moment(today).add(end, 'd'),
          null,
          '[]'
        )
    }
  }
}

// Return a `[)` range of date
export function birthdayAlertRange(
  end: number = 0,
  start: number = 0,
  today: Moment = moment()
): Range {
  if (end === 0) {
    const month = today.month() + 1
    const date = today.date()

    return [
      [month, date],
      [month, date + 1]
    ]
  } else {
    const fromDate = moment(today).add(start, 'days')
    const toDate = moment(today).add(end, 'days')

    return [
      [fromDate.month() + 1, fromDate.date() + 1],
      [toDate.month() + 1, toDate.date() + 1]
    ]
  }
}
