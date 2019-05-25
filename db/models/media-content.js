const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaContentSchema = new Schema({
	createdAt: {type: Number, required: true},
	group: {type: String, required: true},
	text: {type: String},
	type: {type: String, required: true},
	mediaSource: {type: String, required: true},
	mediaSourceUri: {type: String, required: true},
	profileAvatar: {type: String},
	profileFullName: {type: String, required: true},
	url: {type: String, required: true}
});

const MediaContent = mongoose.model('MediaContent', mediaContentSchema);

module.exports = MediaContent;
