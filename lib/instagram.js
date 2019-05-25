const userInstagram = require('user-instagram');

const ig = require('./instagram-scraping');

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

/**
 * Returns posts by instagram account name
 * @param {string} accountName Instagram account name
 * @returns {Promise} Promise with array of posts 
 */
async function getPostsByAccount(accountName) {
	return new Promise((resolve, reject) => {
		userInstagram(`https://www.instagram.com/${accountName}`)
		.then(async (data) => { 
			// get profile data
			const profileData = {...data};
			delete profileData['posts'];
			// for all posts
			for(let i = 0; i < data.posts.length; i++) {
				// if post is video the get full post data with video url
				if(data.posts[i].idVideo) {
					const fullPostData = await ig.scrapePostCode(data.posts[i].shortcode);
					data.posts[i]['fullData'] = fullPostData;
				}
				// attach profile data to post
				data.posts[i]['profileData'] = profileData;
			}
			resolve(data.posts);
		})
		.catch(err => { 
			console.error(err);
			reject(err);
		});
	});
}

module.exports = {
	getLatestMedia: getLatestMedia,
	getPostsByAccount: getPostsByAccount
};

