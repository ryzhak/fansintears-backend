const moment = require('moment');

/**
 * Converts original social media post to FansInTears format
 * @param {Object} originalPost Original post data 
 * @param {string} mediaSource Social media source. Can be: twitter or instagram.
 * @param {string} mediaSourceUri Social media account name
 * @returns {Object} Converted to FansInTears format media post 
 */
function convertPost(originalPost, mediaSource, mediaSourceUri) {
	let convertedPost = {
		createdAt: null,
		mediaSource: mediaSource,
		mediaSourceUri: mediaSourceUri,
		text: null,
		type: null,
		url: null
	};
	if(mediaSource === 'twitter') {
		// if there is only photo in post, NOTICE: we scrape only photo posts
		if(originalPost.images.length === 1) {
			convertedPost.createdAt = moment(originalPost.time).unix();
			convertedPost.text = originalPost.text;
			convertedPost.type = 'photo';
			convertedPost.url = originalPost.images[0];
		}
	}
	if(mediaSource === 'instagram') {
		convertedPost.createdAt = originalPost.timestamp;
		convertedPost.text = originalPost.captionText;
		// if post is video
		if(originalPost.idVideo) {
			convertedPost.type = 'video';
			convertedPost.url = originalPost.fullData.video_url;
		} else {
			// post if photo
			convertedPost.type = 'photo';
			convertedPost.url = originalPost.picture.url;
		}
	}
	return convertedPost;
}

module.exports = {
	convertPost: convertPost
};
