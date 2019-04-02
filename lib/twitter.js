const scrapeTwitter = require('scrape-twitter');

/**
 * Returns latest media from Twitter by tag
 * @param {string} tag Hashtag
 * @return {Object} Media details 
 */
async function getLatestMedia(tag = null) {
	return new Promise((resolve, reject) => {
		// check tag exists
		if(!tag) reject('Tag can not be null');
		// empty result
		let result = {
			createdAt: null,
			text: null,
			username: null,
			isVideo: null,
			mediaUrl: null
		};
		// create parse twitter stream
		let tweets = [];
		new scrapeTwitter.TweetStream(`#${tag}`, 'latest', {count: 1})
			.on('data', (tweet) => { tweets.push(tweet); })
			.on('end', () => {
				// if there are no tweets 
				if(tweets.length == 0) {
					resolve(null);
				} else {
					// tweet was found
					resolve(tweets[0]);
				}
			 })
			.on('error', (err) => { reject(err); });
	});
}

module.exports = {
	getLatestMedia: getLatestMedia
};

