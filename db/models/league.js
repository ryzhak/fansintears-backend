const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
	id:  Number,
	name: String,
	country: String,
	country_code: String,
	season: String,
	season_start: String,
	season_end: String
});

const League = mongoose.model('League', leagueSchema);

module.exports = League;
