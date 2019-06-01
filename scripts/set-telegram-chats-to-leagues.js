const fs = require('fs');

const db = require('../db/db');
const League = require('../db/models/league');

// init DB
db.init();

// run main function
main();

/**
 * Main entrypoint function
 */
async function main() {
	try {
		const leagues = await League.find();
		const groupLink = require(`${__dirname}/../dumps/telegram_league_group_link_29052019.json`);
		// set telegram chats for leagues
		for(let league of leagues) {
			await League.findOneAndUpdate({id: league.id}, {telegram_invite_link: groupLink[league.telegram_group_name]}).catch((err) => { console.log(err); });
		}
		console.log('finished');
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}
