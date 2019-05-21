const moment = require('moment');
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
			isPhoto: null,
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
					result.createdAt = moment(tweets[0].time).unix();
					result.text = tweets[0].text;
					result.username = tweets[0].screenName;
					result.isPhoto = tweets[0].images.length > 0 ? true : false;
					// if tweet with photo
					if(tweets[0].images.length > 0) {
						result.mediaUrl = tweets[0].images;
					} else {
						// tweet with media links
						let mediaLinks = [];
						tweets[0].urls.map(obj => { mediaLinks.push(obj.url); });
						result.mediaUrl = mediaLinks;
					}
					resolve(result);
				}
			 })
			.on('error', (err) => { reject(err); });
	});
}

/**
 * Returns posts by twitter account name
 * @param {string} accountName Twitter account name
 * @returns {Promise} Promise with array of posts 
 */
async function getPostsByAccount(accountName) {
	return new Promise((resolve, reject) => {
		// create parse twitter stream
		let tweets = [];
		new scrapeTwitter.TweetStream(`from:${accountName}`, 'latest', {count: 50})
			.on('data', (tweet) => { 
				// if tweet contains only photo then add it
				if(tweet.images.length === 1) tweets.push(tweet);
			})
			.on('end', () => { resolve(tweets); })
			.on('error', (err) => { reject(err); });
	});
}

module.exports = {
	getLatestMedia: getLatestMedia,
	getPostsByAccount: getPostsByAccount
};

