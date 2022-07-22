import config from './bot.config'
import { Bot } from 'mumu-bot'

const bot = new Bot(config)

bot.command('show_birthday', (ctx) => {
  ctx.reply('这个群记录的生日信息:')
})

bot.command('add_birthday', (ctx) => {
  ctx.reply('成功添加')
})

bot.start()
