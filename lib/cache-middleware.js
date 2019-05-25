/**
 * Middleware is used to cache API requests
 */

const mcache = require('memory-cache');

/**
 * Caches API response for n seconds
 * @param {Number} duration Duration of cache in seconds 
 */
const cache = (duration) => {
	return (req, res, next) => {
		const key = '__express__' + req.originalUrl || req.url;
		const cachedResponse = mcache.get(key);
		if(cachedResponse) {
			res.set({'Content-Type': 'application/json; charset=utf-8'});
			res.send(cachedResponse);
			return;
		} else {
			res.sendResponse = res.send;
			res.send = (body) => {
				mcache.put(key, body, duration * 1000);
				res.sendResponse(body);
			};
			next();
		}
	};
}

module.exports = cache;
