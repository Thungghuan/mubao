import { PrismaClient } from '@prisma/client'
import { BirthdayCreateInput } from '../types'

export async function showAllBirthday(client: PrismaClient) {
  return await client.birthday.findMany()
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
