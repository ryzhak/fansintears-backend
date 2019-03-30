const ig = require('instagram-scraping');

/**
 * Returns latest media from Instagram by tag
 * @param {string} tag Hashtag
 * @return {Object|null} Media details 
 */
async function getLatestMedia(tag = null) {
	if(!tag) throw new Error('Tag can not be null');
	try {
		let result = {
			createdAt: null,
			text: null,
			username: null,
			isVideo: null,
			mediaUrl: null
		};
		const latestPosts = await ig.scrapeTag(tag);
		if(latestPosts.total == 0) return result;
		// assign basic info
		result.createdAt = latestPosts.medias[0].date;
		result.text = latestPosts.medias[0].text;
		// assign username, isVideo and mediaUrl
		const postDetails = await ig.scrapePostCode(latestPosts.medias[0].shortcode);
		result.username = postDetails.owner.username;
		result.isVideo = postDetails.is_video;
		result.mediaUrl = result.isVideo ? postDetails.video_url : postDetails.display_url;
		return result;
	} catch (err) {
		console.log(err);
		return null;
	}
}

module.exports = {
	getLatestMedia: getLatestMedia
};

