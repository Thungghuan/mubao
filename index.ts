import config from './bot.config'
import { Bot, defineConfig } from 'mumu-bot'

const bot = new Bot(config)

bot.start()
