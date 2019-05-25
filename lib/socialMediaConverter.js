const moment = require('moment');

/**
 * Converts original social media post to FansInTears format
 * @param {Object} originalPost Original post data 
 * @param {string} mediaSource Social media source. Can be: twitter or instagram.
 * @param {string} mediaSourceUri Social media account name
 * @param {string} group Media post group. Examples: 'memes', 'players'.
 * @returns {Object} Converted to FansInTears format media post 
 */
function convertPost(originalPost, mediaSource, mediaSourceUri, group) {
	let convertedPost = {
		createdAt: null,
		mediaSource: mediaSource,
		mediaSourceUri: mediaSourceUri,
		group: group,
		text: null,
		type: null,
		url: null,
		profileAvatar: null,
		profileFullName: null
	};
	if(mediaSource === 'twitter') {
		// if there is only photo in post, NOTICE: we scrape only photo posts
		if(originalPost.images.length === 1) {
			convertedPost.createdAt = moment(originalPost.time).unix();
			convertedPost.text = originalPost.text;
			convertedPost.type = 'photo';
			convertedPost.url = originalPost.images[0];
			convertedPost.profileFullName = originalPost.screenName;
		}
	}
	if(mediaSource === 'instagram') {
		convertedPost.createdAt = originalPost.timestamp;
		convertedPost.text = originalPost.captionText;
		convertedPost.profileAvatar = originalPost.profileData.avatar;
		convertedPost.profileFullName = originalPost.profileData.fullName;
		// if post is video
		if(originalPost.isVideo) {
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
