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
			mediaUrl: null,
			text: null,
			username: null
		};
		const latestPosts = await ig.scrapeTag(tag);
		if(latestPosts.total == 0) return result;
		// assign basic info
		result.createdAt = latestPosts.medias[0].date;
		result.mediaUrl = latestPosts.medias[0].display_url;
		result.text = latestPosts.medias[0].text;
		// assign username
		const postDetails = await ig.scrapePostCode(latestPosts.medias[0].shortcode);
		result.username = postDetails.owner.username;
		return result;
	} catch (err) {
		return null;
	}
}

module.exports = {
	getLatestMedia: getLatestMedia
};

