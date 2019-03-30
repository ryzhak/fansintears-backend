/**
 * Returns latest media from Twitter by tag
 * @param {string} tag Hashtag
 * @return {Object} Media details 
 */
async function getLatestMedia(tag = null) {
	if(!tag) throw new Error('Tag can not be null');
	let result = {
		createdAt: 1,
		text: 'Text from post',
		username: 'username',
		isVideo: false,
		mediaUrl: 'http://futbolgrad.com/wp-content/uploads/2015/08/fc-krasnodar-15-16-away-kit.jpg'
	};
	return result;
}

module.exports = {
	getLatestMedia: getLatestMedia
};

