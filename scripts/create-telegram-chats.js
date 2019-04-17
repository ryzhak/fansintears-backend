/**
 * Creates telegram chats based on groups from dumps/telegram_group_link.json
 * NOTICE: bans for 24 hours after ~20 group creations per minute
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// TODO: uncomment for prod
// const telegramGroups = require('../dumps/telegram_group_link_13042019.json');

const telegramGroups = {  
	"ENG_MAN_LEI_FANSINTEARS":"",
	"ENG_NEW_TOT_FANSINTEARS":""
};

// run main function
main();

/**
 * Main entrypoint function
 */
async function main() {
	try {
		for(let groupName of Object.keys(telegramGroups)) {
			console.log(`Creating group ${groupName}`);
			const { stdout, stderr } = await exec(`/home/vladimir/Public/projects/python/tg/bin/telegram-cli -W -e "create_group_chat ${groupName} @fans_in_tears_media_bot"`);
			console.log(`Stdout: ${stdout}`);
			console.log(`Stderr: ${stderr}`);
			await sleep(6000); // min time is 3 seconds, although blocked after 48 group creations per day
		}
		console.log('finished');
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit();
	}
}

/**
 * Helper methods
 */

/**
 * Sleeps for a number of milliseconds
 * @param {Number} ms Number of milliseconds to sleep  
 */
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
