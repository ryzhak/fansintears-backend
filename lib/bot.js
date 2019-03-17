const Telegraf = require('telegraf');

const config = require('../config');
const instagram = require('./instagram');
const telegrafCommandParser = require('./telegraf-command-parser');

const bot = new Telegraf(config.BOT_TOKEN);

// apply command parser
bot.use(telegrafCommandParser());

bot.command('media', async (ctx) => {
	// TODO: validate
	// TODO: file caching for server and media content
	// TODO: update sources to solve https://github.com/rzlyp/instagram-scraping/issues/4
	// TODO: fix russian characters
	// TODO: fix long caption
	const socialNetworkName = ctx.state.command.args[0];
	const tag = ctx.state.command.args[1];
	
	const latestMedia = await instagram.getLatestMedia(tag);
	
	const formattedText = `<b>@${latestMedia.username}</b> from <i>Instagram</i>\n${new Date(latestMedia.createdAt * 1000).toString()}\n${latestMedia.text}`;
	ctx.replyWithPhoto(latestMedia.mediaUrl, {
		caption: formattedText,
		parse_mode: 'HTML'
	});
});

bot.launch();

