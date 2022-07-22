import config from './bot.config'
import { Bot } from 'mumu-bot'

const bot = new Bot(config)

bot.start()
