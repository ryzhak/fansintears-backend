const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fixtureSchema = new Schema({
	id:  Number,
	event_timestamp: Number,
	league_id: Number,
	homeTeam_id: Number,
	awayTeam_id: Number,
	homeTeam: String,
	awayTeam: String,
	telegram_invite_link: String,
	telegram_group_name: String
}, {
	toJSON: {virtuals: true}
});

fixtureSchema.virtual('league', {
	ref: 'League',
	localField: 'league_id',
	foreignField: 'id',
	justOne: true
});

const Fixture = mongoose.model('Fixture', fixtureSchema);

module.exports = Fixture;
