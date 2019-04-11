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
		let groupLink = {};
		for(let fixture of fixtures) {
			groupLink[fixture.telegram_group_name] = '';
		}
		console.log(Object.keys(groupLink).length);
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}
