const db = require('../db/db');
const Fixture = require('../db/models/fixture');
const League = require('../db/models/league');

/**
 * Variables to set
 */
const dumpDate = '06032019';
const countries = ['england', 'france', 'germany', 'italy', 'russia', 'spain'];

// init DB
db.init();

// run main function
main();

/**
 * Main entrypoint function
 */
async function main() {
	await updateLeagues();
	await updateFixtures();
	console.log("finished");
	process.exit();
}

/**
 * MongoDB error handler
 * @param {Object} err Error object 
 */
function handleMongoError(err) {
	console.log(err);
}

/**
 * Updates fixture table
 */
async function updateFixtures() {
	// for all leagues
	for(let country of countries) {
		// read all fixtures from json dump
		const dump = require(`../dumps/fixtures_${country}_${dumpDate}.json`);
		const fixtures = dump.api.fixtures;
		// save fixtures to db
		for(let fixtureId of Object.keys(fixtures)) {
			await Fixture.findOneAndUpdate({id: fixtureId}, fixtures[fixtureId], {upsert: true}).catch(handleMongoError);
		}
	}
}

/**
 * Updates league table
 */
async function updateLeagues() {
	// read all leagues from json dump
	const dump = require(`../dumps/leagues_${dumpDate}.json`);
	const leagues = dump.api.leagues;
	// save leagues to db
	for(let leagueId of Object.keys(leagues)) {
		await League.findOneAndUpdate({id: leagueId}, leagues[leagueId], {upsert: true}).catch(handleMongoError);
	}
}
