const express = require('express');
const { check, validationResult } = require('express-validator/check');
const moment = require('moment');

const config = require('../config');
const db = require('../db/db');
const Fixture = require('../db/models/fixture');

db.init();

const app = express();

app.get('/', (req, res) => res.send('FansInTears backend works'));

/**
 * @api {get} /fixtures Get fixtures
 * @apiDescription Returns fixtures. By default returns fixtures in time range: "now - 6 hours <= now <= now + 2 days"
 * @apiVersion 1.0.0
 * @apiName GetFixtures
 * @apiGroup Fixture
 * 
 * @apiParam {Number} [from] From unix timestamp
 * @apiParam {Number} [to] To unix timestamp
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "_id": "5c81b3b6986149a3f58070e2",
 *       "id": 355,
 *       "__v": 0,
 *       "awayTeam": "Manchester United",
 *       "awayTeam_id": 33,
 *       "event_timestamp": 1552235400,
 *       "homeTeam": "Arsenal",
 *       "homeTeam_id": 42,
 *       "league_id": 2,
 *       "league": {
 *           "_id": "5c81b165986149a3f5805eab",
 *           "id": 2,
 *           "__v": 0,
 *           "country": "England",
 *           "country_code": "GB",
 *           "name": "Premier League",
 *           "season": "2018",
 *           "season_end": "2019-05-12",
 *           "season_start": "2018-08-10"
 *       }
 *   },
 *   {
 *       "_id": "5c81b483986149a3f5808077",
 *       "id": 37828,
 *       "__v": 0,
 *       "awayTeam": "Paris Saint Germain",
 *       "awayTeam_id": 85,
 *       "event_timestamp": 1552158000,
 *       "homeTeam": "Nantes",
 *       "homeTeam_id": 83,
 *       "league_id": 4,
 *       "league": {
 *           "_id": "5c81b165986149a3f5805eaf",
 *           "id": 4,
 *           "__v": 0,
 *           "country": "France",
 *           "country_code": "FR",
 *           "name": "Ligue 1",
 *           "season": "2018",
 *           "season_end": "2019-05-25",
 *           "season_start": "2018-08-10"
 *       }
 *   }
 * ]
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 422 Unprocessable entity
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal server error
 */
app.get('/fixtures', [
	check('from').optional({checkFalsy: true}).isInt(),
	check('to').optional({checkFalsy: true}).isInt()
], handleHttpValidationErrors, async (req, res) => {
	const from = req.query.from || moment().subtract(6, 'hours').unix();
	const to = req.query.to || moment().add(2, 'days').unix();
	const fixtures = await Fixture.find({event_timestamp: {$gte: from, $lt: to}}).populate('league').catch(handleDbError(res));
	res.send(fixtures);
});

app.listen(config.SERVER_PORT, () => console.log(`backend listening on port ${config.SERVER_PORT}`));

/**
 * Helper methods
 */

/**
 * Handles MongoDB error
 * @param {Object} res Express response object 
 */
function handleDbError(res) {
	return (err) => {
		res.status(500).json(err);
	};
}

/**
 * Handles http param validation
 */
/**
 * Handles http param validation
 * @param {Object} req Express request object 
 * @param {Object} res Express response object 
 * @param {Function} next Express next function 
 */
function handleHttpValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		res.status(422).json({errors: errors.array()});
	} else {
		next();
	}
}
