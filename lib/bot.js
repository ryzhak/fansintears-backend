const Telegraf = require('telegraf');

const config = require('../config');

const bot = new Telegraf(config.BOT_TOKEN);

bot.command('hello', (ctx) => {
	ctx.reply('world!');
});

bot.launch();

