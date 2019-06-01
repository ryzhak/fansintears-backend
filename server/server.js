const express = require('express');
const { check, validationResult } = require('express-validator/check');
const moment = require('moment');

const config = require('../config');
const db = require('../db/db');
const Fixture = require('../db/models/fixture');
const League = require('../db/models/league');
const MediaContent = require('../db/models/media-content');

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
 *       "telegram_group_name": "ENG_ARS_MAN_FANSINTEARS",
 *       "telegram_invite_link": "https://t.me/joinchat/GdDWTRXLrxrAg9_sEpvS4g",
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
 *       "telegram_group_name": "FRA_NAN_PAR_FANSINTEARS",
 *       "telegram_invite_link": "https://t.me/joinchat/GdDWTRXLrxrAg9_sEpvS4g",
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

/**
 * @api {get} /leagues Get leagues
 * @apiDescription Returns leagues. By default returns leagues which are not finished yet.
 * @apiVersion 1.0.0
 * @apiName GetLeagues
 * @apiGroup League
 * 
 * @apiSuccessExample Success-Response:
 * [
 *  {
 *       "_id": "5c81b165986149a3f58060e9",
 *       "id": 289,
 *       "__v": 0,
 *       "country": "Australia",
 *       "country_code": "AU",
 *       "name": "National Premier Leagues",
 *       "season": "2019",
 *       "season_end": "2019-08-18",
 *       "season_start": "2019-04-05",
 *       "telegram_group_name": "Australia National Premier Leagues FansInTears",
 *       "telegram_invite_link": "https://t.me/joinchat/GdDWTRDcP-XkV8--tdCTNg",
 *       "logo": "https://www.api-football.com/public/leagues/289.png"
 *	},
 *	{
 *       "_id": "5c81b165986149a3f5806157",
 *       "id": 344,
 *       "__v": 0,
 *       "country": "Peru",
 *       "country_code": "PE",
 *       "name": "Primera Division",
 *       "season": "2019",
 *       "season_end": "2019-11-23",
 *       "season_start": "2019-02-16",
 *       "telegram_group_name": "Peru Primera Division FansInTears",
 *       "telegram_invite_link": "https://t.me/joinchat/GdDWTRaNOaKZwnk17ghPCA",
 *       "logo": ""
 *	}
 * ]
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal server error
 */
app.get('/leagues', async (req, res) => {
	const today = moment().format('YYYY-MM-DD');
	const leagues = await League.find({season_end: {$gte: today}}).sort('country').catch(handleDbError(res));
	res.send(leagues);
});

/**
 * @api {get} /media/content Get media content
 * @apiDescription Returns media content by group
 * @apiVersion 1.0.0
 * @apiName GetMediaContent
 * @apiGroup MediaContent
 * 
 * @apiParam {String} group Media content group. Available values: 'memes' and 'players'.
 * @apiParam {Number} [page] Page number. Default: 0.
 * 
 * @apiHeader {String} X-Total-Count Response header. Total number of records.
 * @apiHeader {String} X-Limit Response header. Number of records per page.
 * @apiHeader {String} X-Page-Last Response header. Index of the past page. Pagination starts from page with index 0.
 * @apiHeader {String} X-Page Response header. Index of the current page. Pagination starts from page with index 0.
 * 
 * @apiSuccessExample Success-Response(memes):
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "_id": "5ce96b65b5062e6bacc4f8e4",
 *       "url": "https://pbs.twimg.com/media/D7bH6i_UIAAWH8e.jpg",
 *       "__v": 0,
 *       "createdAt": 1558799247,
 *       "group": "memes",
 *       "mediaSource": "twitter",
 *       "mediaSourceUri": "TrollFootball",
 *       "profileAvatar": null,
 *       "profileFullName": "TrollFootball",
 *       "text": "OFFICIAL: Pep Guardiola unveiled as the new Juventus manager",
 *       "type": "photo"
 *   },
 *   {
 *       "_id": "5ce96b65b5062e6bacc4f93d",
 *       "url": "https://scontent.cdninstagram.com/vp/166819bcf2c47256785091fb5ee19f6a/5CEBFCCA/t50.2886-16/61727911_2713987785282562_2444701657934196060_n.mp4?_nc_ht=scontent.cdninstagram.com",
 *       "__v": 0,
 *       "createdAt": 1558791455,
 *       "group": "memes",
 *       "mediaSource": "instagram",
 *       "mediaSourceUri": "footballmemesinsta",
 *       "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/5150f7c3f30fa499375ce0cf2ba49232/5D689416/t51.2885-19/s150x150/53687215_311095812887779_1851112225763229696_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
 *       "profileFullName": "Football • Soccer • Fútbol",
 *       "text": "This is the best thing you’ll se all weekend",
 *       "type": "video"
 *   },
 *   {
 *       "_id": "5ce96b65b5062e6bacc4f965",
 *       "url": "https://scontent-frt3-2.cdninstagram.com/vp/9b249cc679a62edd00eed68a563f89ed/5D7D74C1/t51.2885-15/e35/60600023_2336658259943893_7393515027707347534_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
 *       "__v": 0,
 *       "createdAt": 1558791065,
 *       "group": "memes",
 *       "mediaSource": "instagram",
 *       "mediaSourceUri": "officialsoccermemes",
 *       "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/92d40c8cf638de53860991dcba9203f7/5D6788E3/t51.2885-19/s150x150/28764502_1936656559982894_8291188198877429760_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
 *       "profileFullName": "Soccer Memes",
 *       "text": "Only elites remember this derby..",
 *       "type": "photo"
 *   }
 * ]
 * 
 * @apiSuccessExample Success-Response(players):
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "_id": "5ce96b65b5062e6bacc4fa7d",
 *       "url": "https://scontent-frt3-2.cdninstagram.com/vp/73265ce00cc37d36c995eb5e2e361d21/5D869611/t51.2885-15/sh0.08/e35/c0.179.1440.1440a/s640x640/60455430_110022136781972_1050194925618692924_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
 *       "__v": 0,
 *       "createdAt": 1558792059,
 *       "group": "players",
 *       "mediaSource": "instagram",
 *       "mediaSourceUri": "toni.kr8s",
 *       "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/21b37856c41b4b0cebd99114eeec4e93/5D9B13CC/t51.2885-19/s150x150/22802098_503478856676105_1612933203750813696_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
 *       "profileFullName": "Toni Kroos",
 *       "text": "Coming sooooooon! Very excited to present you the cover of my movie KROOS which will be released in Germany on July 4th! Love it! You too? // Ich freue mich sehr, euch das offizielle Cover zum Film KROOS zeigen zu dürfen, der am 4. Juli ins Kino kommt. Gefällt es euch ?",
 *       "type": "photo"
 *   },
 *   {
 *       "_id": "5ce92102c52f963c3b18fd48",
 *       "url": "https://scontent.cdninstagram.com/vp/4adde10d76c05734900e4146e0cf53ac/5CEB37FE/t50.2886-16/61073300_2540740436153145_8306512685139230720_n.mp4?_nc_ht=scontent.cdninstagram.com",
 *       "__v": 0,
 *       "createdAt": 1558731402,
 *       "group": "players",
 *       "mediaSource": "instagram",
 *       "mediaSourceUri": "karimbenzema",
 *       "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/be13818693e5eca9e3bfbcab0e4370e3/5D9BC87F/t51.2885-19/s150x150/49933498_368802787006598_1203420445877993472_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
 *       "profileFullName": "Karim Benzema",
 *       "text": "Nueve",
 *       "type": "video"
 *   }
 * ]
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 422 Unprocessable entity
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal server error
 */
app.get('/media/content', [
	check('group').custom(value => { return value === 'memes' || value === 'players' ? true : false; }),
	check('page').optional().isInt({min: 0})
], handleHttpValidationErrors, async (req, res) => {
	const page = +req.query.page || 0;
	const mediaPosts = await MediaContent.find({group: req.query.group}).skip(config.ITEMS_PER_PAGE * page).limit(config.ITEMS_PER_PAGE).sort('-createdAt').catch(handleDbError(res));
	await setPaginationHeaders(res, MediaContent, {group: req.query.group}, page);
	res.send(mediaPosts);
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

/**
 * Adds http pagination headers to server response
 * @param {Object} res Express response object 
 * @param {Object} model Mongoose model 
 * @param {Object} totalCountCondition Condtition to get total number of records for model 
 * @param {Number} page Current page
 * @returns {Object} Express response object 
 */
async function setPaginationHeaders(res, model, totalCountCondition, page) {
	const totalCount = await model.countDocuments(totalCountCondition).catch(handleDbError(res));
	let pageLast = Math.floor(totalCount / config.ITEMS_PER_PAGE);
	if(totalCount % config.ITEMS_PER_PAGE === 0) pageLast -= 1;
	res.set({
		'X-Total-Count': totalCount,
		'X-Limit': config.ITEMS_PER_PAGE,
		'X-Page-Last': pageLast,
		'X-Page': page
	});
}
