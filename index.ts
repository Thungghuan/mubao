import { Bot } from 'mumu-bot'
import { PrismaClient } from '@prisma/client'
import {
  addBirthday,
  addChatroom,
  findChatroom,
  showAllBirthday,
  showAllChatroom,
  toggleChatroomEnbale,
  updateChatroomName
} from './controller'
import config from './bot.config'

const client = new PrismaClient()

const bot = new Bot(config)

bot.command('show_chatroom', async (ctx) => {
  if (ctx.sender === config.masterQQ) {
    const chatrooms = await showAllChatroom(client)
    let replyMsg = '订阅的生日提醒的聊天有：\nID\tName\tStatus\n'

    chatrooms.forEach((chatroom) => {
      replyMsg += `${chatroom.id} ${chatroom.name} ${
        chatroom.isEnabled ? 'enabled' : 'disabled'
      }`
    })

    ctx.reply(replyMsg)
  }
})

bot.command('toggle_chatroom', async (ctx) => {
  const result = await toggleChatroomEnbale(client, '' + ctx.chatroom)

  ctx.reply(
    `本聊天室生日提醒订阅状态：${result.isEnabled ? '已激活' : '未激活'}`
  )
})

bot.command('update_title', async (ctx) => {
  const name = ctx.command.attrs[0] || ''

  if (!name) {
    await ctx.reply('请告诉我一个提醒的标题哦')
  } else {
    await updateChatroomName(client, '' + ctx.chatroom, name)

    await ctx.reply(`本群提醒标题已经更新为：${name}`)
  }
})

bot.command('show_birthday', async (ctx) => {
  const birthdayData = await showAllBirthday(client)

  let replyMsg = '本群订阅的生日信息有：\nID Name Date\n'

  birthdayData.forEach((birthday) => {
    replyMsg += `${birthday.id} ${birthday.name} ${birthday.month}.${birthday.date}\n`
  })

  await ctx.reply(replyMsg)
})

bot.command('add_birthday', async (ctx) => {
  const chatroomName = ctx.chatroomName
  const chatroomId = '' + ctx.chatroom

  if ((await findChatroom(client, chatroomId)) === null) {
    await addChatroom(client, chatroomName, chatroomId)
    const replyMsg = `成功记录当前群聊
提醒标题：${chatroomName}
订阅状态：已激活
`
    await ctx.reply(replyMsg)
  }

  if (ctx.isQuote) {
    const quoteMessage = ctx.quoteMessage

    if (quoteMessage.origin[0].type === 'Plain') {
      const birthdayData = quoteMessage.origin[0].text

      await addBirthday(client, {
        chatroomId: chatroomId,
        name: 'hi',
        month: 1,
        date: 1
      })

      await ctx.reply('添加数据成功')
    } else {
      await ctx.reply('看不懂你引用的消息捏～按格式发给我哦')
    }
  } else {
    await ctx.reply('请将生日的信息作为引用消息发给我哦～')
  }
})

bot.start()
