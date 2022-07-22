import { PrismaClient } from '@prisma/client'

export async function alert(client: PrismaClient, chatroomId: string) {
  const allBirthdayData = await client.birthday.findMany({
    where: {
      month: 7,
      date: {
        gt: 22
      }
    }
  })

  return JSON.stringify(allBirthdayData)
}
