import { PrismaClient } from '@prisma/client'

interface BirthdayCreateInput {
  name: string
  month: number
  date: number
  chatroomId: string
}

export async function showAllBirthday(client: PrismaClient) {
  const result = await client.birthday.findMany()

  console.log(result)
}

export async function addBirthday(
  client: PrismaClient,
  birthdayData: BirthdayCreateInput
) {
  const { name, month, date, chatroomId } = birthdayData

  return await client.birthday.upsert({
    where: {
      name
    },
    create: {
      name,
      month,
      date,
      chatroomId
    },
    update: {
      month,
      date
    }
  })
}
