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
 * Returns telegram group name by fixture home team, away team and country
 * @param {Object} fixture Fixture data
 * @returns {Promise} Promise with telegram group name 
 */
async function getTelegramGroupName(fixture) {
	const league = await League.findOne({id: fixture.league_id}).catch(handleMongoError);
	const countryName = league.country.slice(0,3).toUpperCase();
	const homeTeamName = fixture.homeTeam.slice(0,3).toUpperCase();
	const awayTeamName = fixture.awayTeam.slice(0,3).toUpperCase();
	const telegramGroupName = `${countryName}_${homeTeamName}_${awayTeamName}_FANSINTEARS`.replace(' ', '');
	return telegramGroupName;
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
			let fixture = fixtures[fixtureId];
			fixture.telegram_invite_link = 'https://t.me/joinchat/GdDWTRXLrxrAg9_sEpvS4g';
			fixture.telegram_group_name = await getTelegramGroupName(fixtures[fixtureId]);
			await Fixture.findOneAndUpdate({id: fixtureId}, fixture, {upsert: true}).catch(handleMongoError);
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
