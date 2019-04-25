const fs = require('fs');

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
		const fixtures = await Fixture.find();
		const groupLink = require('../dumps/telegram_group_link_13042019.json');
		// set telegram chats for fixtures
		for(let fixtureId of Object.keys(fixtures)) {
			const fixture = fixtures[fixtureId];
			await Fixture.findOneAndUpdate({id: fixtureId}, {telegram_invite_link: groupLink[fixture.telegram_group_name]}, {upsert: true}).catch((err) => { console.log(err); });
		}
		console.log('finished');
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}
