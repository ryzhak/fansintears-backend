var request = require('request'),
    Promise = require('bluebird'),
    async   = require('async'),
    listURL = 'https://www.instagram.com/explore/tags/',
    postURL = 'https://www.instagram.com/p/',
    locURL  = 'https://www.instagram.com/explore/locations/',
    dataExp = /window\._sharedData\s?=\s?({.+);<\/script>/;

exports.deepScrapeTagPage = function(tag) {
    return new Promise(function(resolve, reject){
        exports.scrapeTag(tag).then(function(tagPage){
            return Promise.map(tagPage.medias, function(media, i, len) {
                return exports.scrapePostCode(media.shortcode).then(function(postPage){
                    tagPage.medias[i] = postPage;
                    if (postPage.location != null && postPage.location.has_public_page) {
                        return exports.scrapeLocation(postPage.location.id).then(function(locationPage){
                            tagPage.media[i].location = locationPage;
                        })
                        .catch(function(err) {
                            console.log("An error occurred calling scrapeLocation inside deepScrapeTagPage" + ":" + err);
                        });
                    }
                })
                .catch(function(err) {
                    console.log("An error occurred calling scrapePostPage inside deepScrapeTagPage" + ":" + err);
                });
            })
            .then(function(){ resolve(tagPage); })
            .catch(function(err) {
                console.log("An error occurred resolving tagPage inside deepScrapeTagPage" + ":" + err);
            });
        })
        .catch(function(err) {
                console.log("An error occurred calling scrapeTagPage inside deepScrapeTagPage" + ":" + err);
        });        
    });
};

exports.scrapeTag = function(tag) {
    return new Promise(function(resolve, reject){
        if (!tag) return reject(new Error('Argument "tag" must be specified'));
          var options = {
            url: listURL + tag,
            headers: {
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
            }
          };
        request(options, function(err, response, body){
            if (err) return reject(err);

            var data = scrape(body)
            if (data) {
                var media = data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media;
                var edges = media.edges;

                async.waterfall([
                    (callback)=>{
                         var medias = [];
                         edges.forEach((post)=>{
                    
                            var text =
                            post.node.edge_media_to_caption.edges[0] !== undefined
                                ? post.node.edge_media_to_caption.edges[0].node.text
                                : "";

                            medias.push({
                                media_id : post.node.id,
                                shortcode : post.node.shortcode,
                                text : text,
                                comment_count : post.node.edge_media_to_comment,
                                like_count : post.node.edge_liked_by,
                                display_url : post.node.display_url,
                                owner_id : post.node.owner.id,
                                date : post.node.taken_at_timestamp,
                                thumbnail : post.node.thumbnail_src,
                                thumbnail_resource : post.node.thumbnail_resources
                            })
                        });
                         callback(null, medias);
                    }    
                ], (err, results)=>{
                        resolve({
                            total : results.length,
                            medias : results
                        })   
                })
                
            }
            else {
                reject(new Error('Error scraping tag page "' + tag + '"'));
            }
        })
    });
};

exports.scrapePostCode = function(code) {
    return new Promise(function(resolve, reject){
        if (!code) return reject(new Error('Argument "code" must be specified'));

        request(postURL + code, function(err, response, body){
            var data = scrape(body);
            if (data && data.entry_data && 
                data.entry_data.PostPage[0] && 
                data.entry_data.PostPage[0].graphql && 
                data.entry_data.PostPage[0].graphql.shortcode_media) {
                resolve(data.entry_data.PostPage[0].graphql.shortcode_media); 
            }
            else {
                reject(new Error('Error scraping post page "' + code + '"'));
            }
        });
    });
}
exports.scrapeLocation = function(id) {
    return new Promise(function(resolve, reject){
        if (!id) return reject(new Error('Argument "id" must be specified'));
        
        request(locURL + id, function(err, response, body){
            var data = scrape(body);

            if (data && data.entry_data && 
                data.entry_data.LocationsPage[0] && 
                data.entry_data.LocationsPage[0].location) {
                resolve(data.entry_data.LocationsPage[0].location);
            }
            else {
                reject(new Error('Error scraping location page "' + id + '"'));
            }
        });
    });
}
var scrape = function(html) {
    try {
        var dataString = html.match(dataExp)[1];
        var json = JSON.parse(dataString);
    }
    catch(e) {
        if (process.env.NODE_ENV != 'production') {
            console.error('The HTML returned from instagram was not suitable for scraping');
        }
        return null
    }

    return json;
}

