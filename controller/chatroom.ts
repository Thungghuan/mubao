import { PrismaClient } from '@prisma/client'

export async function addChatroom(
  client: PrismaClient,
  name: string,
  id: string
) {
  const result = await client.chatroom.upsert({
    where: {
      id
    },
    create: {
      name,
      id
    },
    update: {
      name
    }
  })

  return result
}

export async function showAllChatroom(client: PrismaClient) {
  return await client.chatroom.findMany()
}

export async function findChatroom(client: PrismaClient, id: string) {
  return await client.chatroom.findUnique({
    where: {
      id
    }
  })
}

export async function toggleChatroomEnbale(client: PrismaClient, id: string) {
  const isEnabled = !(await findChatroom(client, id)).isEnabled

  return await client.chatroom.update({
    where: {
      id
    },
    data: {
      isEnabled
    }
  })
}
