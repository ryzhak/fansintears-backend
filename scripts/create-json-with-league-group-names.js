const fs = require('fs');

const db = require('../db/db');
const League = require('../db/models/league');

const leagueTimestamp = '03082019';

// init DB
db.init();

// run main function
main();

/**
 * Main entrypoint function
 */
async function main() {
	try {
		// load all leagues with telegram groups
		const leagueTelegramGroups = require(`../dumps/telegram_league_group_link_${leagueTimestamp}.json`);
		// load all leagues from DB
		const leagues = await League.find();
		for(let league of leagues) {
			// if group exists then continue
			if(leagueTelegramGroups[league.telegram_group_name]) continue;
			// set add league with empty telegram group
			leagueTelegramGroups[league.telegram_group_name] = '';
		}
		fs.writeFileSync(`${__dirname}/../dumps/telegram_league_group_link_${leagueTimestamp}.json`, JSON.stringify(leagueTelegramGroups), 'utf-8');
		console.log('finished');
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}
