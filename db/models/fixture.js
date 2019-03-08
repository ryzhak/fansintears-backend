const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fixtureSchema = new Schema({
	id:  Number,
	event_timestamp: Number,
	league_id: Number,
	homeTeam_id: Number,
	awayTeam_id: Number,
	homeTeam: String,
	awayTeam: String
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

module.exports = Fixture;
