const db = require('../db/db');
const MediaContent = require('../db/models/media-content');
const mediaSources = require('../dumps/media_sources.json');
const instagram = require('../lib/instagram');
const socialMediaConverter = require('../lib/socialMediaConverter');
const twitter = require('../lib/twitter');

// init DB
db.init();

// run main function
main();

/**
 * Main entrypoing function
 */
async function main() {
	try {
		let mediaPosts = [];
		// for all media post groups
		for(let group of Object.keys(mediaSources)) {
			// for all accounts
			for(let mediaSource of mediaSources[group]) {
				// get latest posts
				let posts = [];
				if(mediaSource.source === 'twitter') posts = await twitter.getPostsByAccount(mediaSource.uri);
				if(mediaSource.source === 'instagram') posts = await instagram.getPostsByAccount(mediaSource.uri);
				// convert posts to FansInTears format
				posts = posts.map(post => socialMediaConverter.convertPost(post, mediaSource.source, mediaSource.uri, group));
				mediaPosts.push(...posts);
			}	
		}
		await savePosts(mediaPosts);
	} catch (err) {
		console.error(err);
	}
	process.exit();
}

/**
 * Saves medis posts into DB
 * @param {Array} mediaPosts Array of media posts
 */
async function savePosts(mediaPosts) {
	try {
		for(let mediaPost of mediaPosts) {
			await MediaContent.findOneAndUpdate({url: mediaPost.url}, mediaPost, {upsert: true});
		}
	} catch (err) {
		console.error('Error on saving MediaPost')
		console.error(err);
	}
}
