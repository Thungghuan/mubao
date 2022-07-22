import { Bot } from 'mumu-bot'
import { Birthday, PrismaClient } from '@prisma/client'
import {
  addBirthday,
  addChatroom,
  findChatroom,
  showAllChatroom
} from './controller'
import config from './bot.config'

const client = new PrismaClient()

const bot = new Bot(config)

bot.command('show_birthday', (ctx) => {
  ctx.reply('这个群记录的生日信息:')
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
