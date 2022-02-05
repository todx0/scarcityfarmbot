require('dotenv').config()
const { Telegraf } = require('telegraf')
const { MenuTemplate, MenuMiddleware } = require('telegraf-inline-menu')
const xpquest = require('./scripts/xpquest-send')
const materialsSend = require('./scripts/materials-send')
const materialsTransfer = require('./scripts/materials-transfer')
const countAdventurers = require('./scripts/count-adventurers')
const summonAdventurer = require('./scripts/summon')
const bot = new Telegraf(process.env.BOT_TOKEN, { handlerTimeout: 9_000_000 }) // handler timeout increased because of https://github.com/telegraf/telegraf/issues/1479

if (!process.env.BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

bot.command('xpquest', (ctx) => {
	ctx.reply('Starting...')
	;(async () => {
		const result = await xpquest.sendXpQuest()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})

bot.command('materialssend', (ctx) => {
	ctx.reply('Starting...')
	;(async () => {
		const result = await materialsSend.sendMaterialsFarming()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})

bot.command('materialstransfer', (ctx) => {
	ctx.reply('Starting...')
	;(async () => {
		const result = await materialsTransfer.transferMaterials()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})

bot.command('count', (ctx) => {
	ctx.reply('Starting...')
	;(async () => {
		const result = await countAdventurers.countAdventurers()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})

bot.command('retrieve', (ctx) => {
	ctx.reply('Starting...')
	;(async () => {
		const result = await countAdventurers.retrieveAdventurers()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})

bot.command('summon', (ctx) => {
	ctx.reply('Starting...')
	;(async () => {
		const result = await summonAdventurer.summonAdventurer()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})

const menuTemplate = new MenuTemplate((ctx) => `Hey ${ctx.from.first_name}!`)

menuTemplate.interact('🔄 Re-count my adventurers', 'a', {
	do: async (ctx) => {
		ctx.reply('Counting...')
		const result = await countAdventurers.countAdventurers()
		ctx.reply(`${result}`)
		return false
	},
})
menuTemplate.interact('🏋🏻 Send adventurers to farm XP', 'b', {
	do: async (ctx) => {
		ctx.reply('Sending...')
		const result = await xpquest.sendXpQuest()
		ctx.reply(`${result}`)
		return false
	},
})
menuTemplate.interact('🧱 Send adventurers to farm materials', 'c', {
	do: async (ctx) => {
		ctx.reply('Sending...')
		const result = await materialsSend.sendMaterialsFarming()
		ctx.reply(`${result}`)
		return false
	},
})

menuTemplate.interact('📦 Transfer materials to crafter', 'd', {
	do: async (ctx) => {
		ctx.reply('Sending...')
		const result = await materialsTransfer.transferMaterials()
		ctx.reply(`${result}`)
		return false
	},
})

menuTemplate.interact('📞 Summon new adventurer', 'e', {
	do: async (ctx) => {
		ctx.reply('Sending...')
		const result = await summonAdventurer.summonAdventurer()
		ctx.reply(`${result}`)
		return false
	},
})

const menuMiddleware = new MenuMiddleware('/', menuTemplate)
bot.command('menu', (ctx) => menuMiddleware.replyToContext(ctx))
bot.use(menuMiddleware)
bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
