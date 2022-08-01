import { Bot } from 'mumu-bot'
import { PrismaClient } from '@prisma/client'
import {
  addBirthday,
  addChatroom,
  alert,
  alertAllChatroom,
  findChatroom,
  showAllBirthday,
  showAllChatroom,
  toggleChatroomEnbale,
  updateChatroomName
} from './controller'
import config from './bot.config'
import { parseBirthdayData } from './utils'
import schedule from 'node-schedule'

const client = new PrismaClient()

const bot = new Bot(config)

bot.command('show_chatroom', async (ctx) => {
  if (ctx.sender === config.masterQQ) {
    const chatrooms = await showAllChatroom(client)
    let replyMsg = '订阅的生日提醒的聊天有：\nID\tName\tStatus\n'

    replyMsg += chatrooms
      .map(
        (chatroom) =>
          `${chatroom.id} ${chatroom.name} ${
            chatroom.isEnabled ? 'enabled' : 'disabled'
          }`
      )
      .join('\n')

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

  if (birthdayData && birthdayData.length > 0) {
    let replyMsg = '本群订阅的生日信息有：\nID Name Date\n'

    replyMsg += birthdayData
      .map((birthday) => {
        const month =
          birthday.month < 10 ? `0${birthday.month}` : `${birthday.month}`
        const date =
          birthday.date < 10 ? `0${birthday.date}` : `${birthday.date}`

        return `${birthday.id} ${birthday.name} ${month}.${date}`
      })
      .join('\n')

    await ctx.reply(replyMsg)
  } else {
    await ctx.reply('本群还没有订阅生日信息哦')
  }
})

bot.command('add_birthday', async (ctx) => {
  const chatroomName = ctx.chatroomName
  const chatroomId = '' + ctx.chatroom
  const isGroup = ctx.chatroomType === 'Group'

  if ((await findChatroom(client, chatroomId)) === null) {
    await addChatroom(client, chatroomName, isGroup, chatroomId)
    const replyMsg = `成功记录当前群聊
提醒标题：${chatroomName}
订阅状态：已激活`
    await ctx.reply(replyMsg)
  }

  if (ctx.isQuote) {
    const quoteMessage = ctx.quoteMessage

    if (quoteMessage.origin[0].type === 'Plain') {
      const birthdayData = quoteMessage.origin[0].text

      const allData = parseBirthdayData(birthdayData, chatroomId)

      allData.forEach(async (data) => {
        await addBirthday(client, data)
      })

      await ctx.reply(`添加数据成功，共有${allData.length}条数据`)
    } else {
      await ctx.reply('看不懂你引用的消息捏～按格式发给我哦')
    }
  } else {
    await ctx.reply('请将生日的信息作为引用消息发给我哦～')
  }
})

bot.command('alert', async (ctx) => {
  const chatroom = await findChatroom(client, '' + ctx.chatroom)

  if (chatroom) {
    await ctx.reply(await alert(client, '' + ctx.chatroom))
  } else {
    await ctx.reply('本群还没有订阅提醒呀～')
  }
})

bot.start()

schedule.scheduleJob('0 0 * * *', async () => {
  const allChatroomMessage = await alertAllChatroom(client)
  allChatroomMessage.forEach(async ([chatroomId, isGroup, replyMessage]) => {
    await bot.sendMessage(
      +chatroomId,
      isGroup ? 'Group' : 'Friend',
      replyMessage
    )
  })
})

process.on('SIGINT', function () {
  schedule.gracefulShutdown().then(() => process.exit(0))
})
