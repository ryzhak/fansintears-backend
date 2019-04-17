const fs = require('fs');
const moment = require('moment');

const db = require('../db/db');
const Fixture = require('../db/models/fixture');

// init DB
db.init();

// run main function
main();

/**
 * Main entrypoint function
 */
async function main() {
	try {
		const path = '../dumps/telegram_group_link_13042019.json';
		let groupLink = require(path);
		// find all future fixtures
		const fixtures = await Fixture.find({event_timestamp: {$gte: moment().unix()}});
		// if there is no telegram group for it then mark it with "!" sign
		let count = 0;
		for(let fixture of fixtures) {
			if(groupLink[fixture.telegram_group_name] === '') {
				groupLink[fixture.telegram_group_name] = '!';
				count++;
			}
		}
		console.log(`Need to create ${count} telegram groups`);
		// save group_link file
		fs.writeFileSync(`${__dirname}/${path}`, JSON.stringify(groupLink), 'utf-8');
		console.log('finished');
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}
