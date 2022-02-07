require('dotenv').config()
const { Telegraf } = require('telegraf')
const xpquest = require('./scripts/xpquest-send')
const materialsSend = require('./scripts/materials-send')
const materialsTransfer = require('./scripts/materials-transfer')
const countAdventurers = require('./scripts/count-adventurers')
const summonAdventurer = require('./scripts/summon')
const bot = new Telegraf(process.env.BOT_TOKEN, { handlerTimeout: 9_000_000 }) // handler timeout increased because of https://github.com/telegraf/telegraf/issues/1479

if (!process.env.BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

// V3.0.0

const inline_menu = {
	reply_markup: {
		one_time_keyboard: false,
		inline_keyboard: [
			[{ text: '🔄 Re-count my adventurers', callback_data: 'recount' }],
			[{ text: '🏋🏻 Send adventurers to farm XP', callback_data: 'xpfarm' }],
			[{ text: '🧱 Send adventurers to farm materials', callback_data: 'materialsfarm' }],
			[{ text: '📦 Transfer materials to crafter', callback_data: 'materialstransfer' }],
			[{ text: '📞 Summon new adventurer', callback_data: 'summon' }],
		],
	},
}
const menu = {
	reply_markup: {
		one_time_keyboard: false,
		keyboard: [[{ text: 'Menu' }]],
	},
}
bot.command('retrieve', (ctx) => {
	ctx.reply('Starting...')
	;(async () => {
		const result = await countAdventurers.retrieveAdventurers()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})
bot.command('menu', (ctx) => ctx.reply('Choose action:', menu))
bot.hears('Menu', (ctx) => ctx.reply('Choose action:', inline_menu))
bot.action('recount', (ctx) => {
	;(async () => {
		ctx.reply('Starting...')
		const result = await countAdventurers.countAdventurers()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})
bot.action('xpfarm', (ctx) => {
	;(async () => {
		ctx.reply('Sending...')
		const result = await xpquest.sendXpQuest()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})
bot.action('materialsfarm', (ctx) => {
	;(async () => {
		ctx.reply('Starting...')
		const result = await materialsSend.sendMaterialsFarming()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})
bot.action('materialstransfer', (ctx) => {
	;(async () => {
		ctx.reply('Starting...')
		const result = await materialsTransfer.transferMaterials()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})
bot.action('summon', (ctx) => {
	;(async () => {
		ctx.reply('Starting...')
		const result = await summonAdventurer.summonAdventurer()
		ctx.reply(`${result}`)
	})().catch((err) => {
		console.error(err)
	})
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
