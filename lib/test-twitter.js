const twitter = require('./twitter');

main();

async function main() {
	let r = await twitter.getLatestMedia('nature');
	console.log(r);
}

