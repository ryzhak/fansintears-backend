const Telegraf = require('telegraf');

const config = require('../config');
const instagram = require('./instagram');
const telegrafCommandParser = require('./telegraf-command-parser');
const twitter = require('./twitter');

const bot = new Telegraf(config.BOT_TOKEN);

// apply command parser
bot.use(telegrafCommandParser());

/**
 * Returns bot usage instructions
 * @param {Object} ctx Telegrafjs context object
 */
bot.command('help', async (ctx) => {
	ctx.reply(getTextHelp(), {
		parse_mode: 'HTML',
		reply_to_message_id: ctx.update.message.message_id
	});
});

/**
 * Responses with media
 * @param {Object} ctx Telegrafjs context object
 */
bot.command('media', async (ctx) => {
	// TODO: file caching for server and media content
	// validate command
	if(!validateMediaCommand(ctx)) {
		const validationError = `Ooops...invalid command\n\n${getTextExamples()}`;
		ctx.reply(validationError, {
			parse_mode: 'HTML', 
			reply_to_message_id: ctx.update.message.message_id
		});
		return;
	}
	// get params
	const socialNetworkName = ctx.state.command.args[0];
	const tag = ctx.state.command.args[1];
	// get latest media
	let latestMedia = null;
	if(socialNetworkName == 'instagram') latestMedia = await instagram.getLatestMedia(tag);
	if(socialNetworkName == 'twitter') latestMedia = await twitter.getLatestMedia(tag);
	if(!latestMedia) {
		ctx.reply(`No content found for hashtag <b>#${tag}</b>`, {
			parse_mode: 'HTML', 
			reply_to_message_id: ctx.update.message.message_id
		});
		return;
	}
	// respond
	const replyParams = {
		caption: getTextMedia(socialNetworkName, latestMedia),
		parse_mode: 'HTML',
		reply_to_message_id: ctx.update.message.message_id
	};
	if(latestMedia.isVideo) {
		ctx.replyWithVideo(latestMedia.mediaUrl, replyParams);
	} else {
		ctx.replyWithPhoto(latestMedia.mediaUrl, replyParams);
	}
});

/**
 * Returns bot usage instructions
 * @param {Object} ctx Telegrafjs context object
 */
bot.command('start', async (ctx) => {
	ctx.reply(getTextHelp(), {
		parse_mode: 'HTML',
		reply_to_message_id: ctx.update.message.message_id
	});
});

bot.launch();

/**
 * Helper methods
 */

/**
 * Returns text with command examples
 * @returns {string} Text with command examples
 */
function getTextExamples() {
	const titleExamlpes = '<b>Example Commands</b>\n';
	const exampleInstagram = '<i>/media instagram juventus</i> - get latest post from Instagram with "juventus" hashtag\n';
	const exampleTwitter = '<i>/media twitter valencia</i> - get latest post from Twitter with "valencia" hashtag\n';
	return `${titleExamlpes}${exampleInstagram}${exampleTwitter}`;
}

/**
 * Returns help text with bot description
 * @returns {string} Text with bot description
 */
function getTextHelp() {
	const title = '<b>What can this bot do?\n\n</b>';
	const desc = 'Get latest media from Instagram and Twitter by hashtag.\n\n';
	const commandExamples = getTextExamples();
	return `${title}${desc}${commandExamples}`;
}

/**
 * Returns text content for media
 * @param {string} socialNetworkName Social network name 
 * @param {Object} latestMedia Media details
 * @returns {string} Text for media post in telegram 
 */
function getTextMedia(socialNetworkName, latestMedia) {
	let text = `<b>@${latestMedia.username}</b> from <i>${socialNetworkName.charAt(0).toUpperCase()}${socialNetworkName.slice(1)}</i>\n${new Date(latestMedia.createdAt * 1000).toString()}\n${latestMedia.text}`;
	// slice text to 1024 symblos to fit telegram caption length
	return text.slice(0, 1024);
}

/**
 * Validates "media" command
 * @param {Object} ctx Telegrafjs context object
 * @returns {boolean} Whether command is valid
 */
function validateMediaCommand(ctx) {
	if(ctx.state.command.args.length != 2) return false;
	if(!['instagram', 'twitter'].includes(ctx.state.command.args[0])) return false;
	if(!/^[a-z0-9]+$/i.test(ctx.state.command.args[1])) return false;
	return true;
}

