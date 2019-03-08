const mongoose = require('mongoose');

const config = require('../config');

/**
 * Initializes DB connection
 */
function init() {
	mongoose.connect(config.MONGO_CONNECTION_STRING, {useNewUrlParser: true});
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', () => { console.log('connected to MongoDB'); });
}

module.exports = {
	init
};
