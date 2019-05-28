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
		let groupLink = {};
		for(let league of leagues) {
			groupLink[league.telegram_group_name] = '';
		}
		fs.writeFileSync(`${__dirname}/../dumps/telegram_league_group_link_29052019.json`, JSON.stringify(groupLink), 'utf-8');
		console.log('finished');
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}
