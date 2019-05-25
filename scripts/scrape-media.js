const mediaSources = require('../dumps/media_sources.json');
const instagram = require('../lib/instagram');
const socialMediaConverter = require('../lib/socialMediaConverter');
const twitter = require('../lib/twitter');

// run main function
main();

/**
 * Main entrypoing function
 */
async function main() {
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
	console.log(mediaPosts);
	console.log(mediaPosts.length);
}
