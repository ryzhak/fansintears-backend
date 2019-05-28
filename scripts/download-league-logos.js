/**
 * Downloads league logos from league dump
 */

const fs = require('fs');
const request = require('request');

const leaguesDump = require('../dumps/leagues_11052019.json');
const leagues = leaguesDump.api.leagues;

/**
 * Downloads logo
 * @param {string} uri Image url 
 * @param {string} filename Full path to image on disk 
 * @param {Function} callback Callback called after execution 
 */
function download(uri, filename, callback) {
	request.head(uri, (err, res, body) => {
		if(err) {
			console.error('error on download');
			console.error(err);
		}
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

// for all leagues download logos if it exists
for(let i of Object.keys(leagues)) {
	if(leagues[i].logo !== '') {
		const filename = `${__dirname}/../images/league_logos/${leagues[i].league_id}.png`;
		download(leagues[i].logo, filename, () => { console.log('done'); });
	}
};
