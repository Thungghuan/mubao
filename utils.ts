import { BirthdayCreateInput } from './types'

export function parseBirthdayData(
  birthdayDataMessage: string,
  chatroomId: string
) {
  const textSplit: string[] = birthdayDataMessage.split(
    /:|：|\s+|\n|\s*周[日一二三四五六]/
  )
  const names = textSplit.filter((el) => el).filter((el, i) => i % 2 === 0)
  const dates = textSplit.filter((el) => el).filter((el, i) => i % 2 === 1)

  const birthdayData: BirthdayCreateInput[] = []
  names.forEach((name, i) => {
    let month = +dates[i].split(/-|\./)[0]
    let date = +dates[i].split(/-|\./)[1]

    // if (month.length < 2) {
    //   month = '0' + month
    // }
    // if (date.length < 2) {
    //   console.log(date)
    //   date = '0' + date
    // }

    const data: BirthdayCreateInput = {
      name,
      month,
      date,
      chatroomId
    }

    birthdayData.push(data)
  })

  return birthdayData
}
