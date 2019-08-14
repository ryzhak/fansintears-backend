const db = require('../db/db');
const Fixture = require('../db/models/fixture');
const League = require('../db/models/league');

/**
 * Variables to set
 */
const dumpDate = '03082019';
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
	await fixLeagues();
	// TODO: refactor: delete fixtures as they are unused
	// await updateFixtures();
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
	const telegramGroupName = `${countryName}_${homeTeamName}_${awayTeamName}_FANSINTEARS`.replace(/ /g, '');
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
			fixture.telegram_group_name = await getTelegramGroupName(fixtures[fixtureId]);
			await Fixture.findOneAndUpdate({id: fixtureId}, fixture, {upsert: true}).catch(handleMongoError);
		}
	}
}

/**
 * Updates league table
 */
async function updateLeagues() {
	// delete all leagues
	await League.collection.drop();
	// read all leagues from json dump
	const dump = require(`../dumps/leagues_${dumpDate}.json`);
	const leagues = dump.api.leagues;
	// save leagues to db
	for(let leagueId of Object.keys(leagues)) {
		const mLeague = await League.findOne({id: leagueId}).catch(handleMongoError);
		// if league exists then continue
		if(mLeague) continue;
		// create a new league
		leagues[leagueId].telegram_group_name = `${leagues[leagueId].country} ${leagues[leagueId].name} FansInTears`;
		leagues[leagueId].telegram_invite_link = leagues[leagueId].telegram_invite_link || null;
		await League.findOneAndUpdate({id: leagueId}, leagues[leagueId], {upsert: true}).catch(handleMongoError);
	}
}

/**
 * Fixes league issues
 * 1) Removes symbol "'" in telegram group names
 * 2) Removes svg and gif logos because mobile apps do not support then
 */
async function fixLeagues() {
	const leagues = await League.find();
	for(let league of leagues) {
		// remove symbol "'"
		await League.findOneAndUpdate({id: league.id}, {telegram_group_name: league.telegram_group_name.replace(/'/g, ' ')}, {upsert: true}).catch(handleMongoError);
		// remove svg and gif logos
		if(league.logo.toLowerCase().includes('svg') || league.logo.toLowerCase().includes('gif')) {
			await League.findOneAndUpdate({id: league.id}, {logo: ""}, {upsert: true}).catch(handleMongoError);
		}
	}
}
