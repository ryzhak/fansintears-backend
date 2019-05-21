const userInstagram = require('user-instagram');

const socialMediaConverter = require('../lib/socialMediaConverter');
const twitter = require('../lib/twitter');

/**
 * Twitter accounts with memes
 */
const twitterMemeAccounts = [
	'TrollFootball',
	'FootyHumour',
	'FootballMemesCo'
];

// run main function
main();

/**
 * Main entrypoing function
 */
async function main() {
	let mediaPosts = [];
	// for all twitter accounts
	for(let accountName of twitterMemeAccounts) {
		// get latest posts
		let tweets = await twitter.getPostsByAccount(accountName);
		// convert posts to FansInTears format
		tweets = tweets.map(tweet => socialMediaConverter.convertPost(tweet, 'twitter'));
		mediaPosts.push(...tweets);
	}
	console.log(mediaPosts);
}

// userInstagram('https://www.instagram.com/footballmemesinsta')
// .then(data => {
// 	console.log(data.posts.length);
//   	console.log(`Full name is: ${data.fullName}`);
// })
// .catch(e => {
// 	// Error will trigger if the account link provided is false.
//   	console.error(data);
// });