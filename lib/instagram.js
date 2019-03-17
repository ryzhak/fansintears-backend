const ig = require('instagram-scraping');

async function getLatestMedia(tag = null) {
	if(!tag) throw new Error('Tag can not be null');
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
}

module.exports = {
	getLatestMedia: getLatestMedia
};

// photo
// ig.scrapePostCode('BvEZKiEFg6y').then(function(result){
//     console.log(result);
// });

// { __typename: 'GraphImage',
//   id: '2000834809392664242',
//   shortcode: 'BvEZKiEFg6y',
//   dimensions: { height: 1349, width: 1080 },
//   gating_info: null,
//   media_preview:
//    'ACEqvM1Rk00mlJqDoQYzTSuaa86RkBj1/HH19Kn21JRB5IoqxtoosFyCoJ3OQi9T/KpSQBWbLMSeP4/zAB4H9aoglmR8E4zkjJ9h/PpWnC4dQQc1StpGfavGAfTqP88/jVyKNUZivQ9MdM//AFqQ73JqKbmigZUcZFUnURkAd+uea0TWZL99vof5VTI6lRnZmLLnHX2AratJjKmWAGDjjgdBWZAP3Ev0H86v2P8AqR9T/OhgizvoqKipNT//2Q==',
//   display_url:
//    'https://scontent-arn2-2.cdninstagram.com/vp/a8478757972a898b44c99e581f603adf/5D2A3884/t51.2885-15/e35/52858446_2217664851650527_8307212485120922372_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//   display_resources:
//    [ { src:
//         'https://scontent-arn2-2.cdninstagram.com/vp/1f0e12b99ee55b6a4f06a868043a6604/5D108EEE/t51.2885-15/sh0.08/e35/p640x640/52858446_2217664851650527_8307212485120922372_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//        config_width: 640,
//        config_height: 799 },
//      { src:
//         'https://scontent-arn2-2.cdninstagram.com/vp/308100a1d562df834f9887c5f3dc9ebd/5D130B2A/t51.2885-15/sh0.08/e35/p750x750/52858446_2217664851650527_8307212485120922372_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//        config_width: 750,
//        config_height: 936 },
//      { src:
//         'https://scontent-arn2-2.cdninstagram.com/vp/a8478757972a898b44c99e581f603adf/5D2A3884/t51.2885-15/e35/52858446_2217664851650527_8307212485120922372_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//        config_width: 1080,
//        config_height: 1349 } ],
//   accessibility_caption: 'Image may contain: 1 person, standing',
//   is_video: false,
//   should_log_client_event: false,
//   tracking_token:
//    'eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjpmYWxzZSwidXVpZCI6ImE4MDEyNTA1MzY0ZDQzMGNhYjdkNDY2MDRjOWFiZjUyMjAwMDgzNDgwOTM5MjY2NDI0MiJ9LCJzaWduYXR1cmUiOiIifQ==',
//   edge_media_to_tagged_user: { edges: [] },
//   edge_media_to_caption: { edges: [ [Object] ] },
//   caption_is_edited: false,
//   has_ranked_comments: false,
//   edge_media_to_comment:
//    { count: 0,
//      page_info: { has_next_page: false, end_cursor: null },
//      edges: [] },
//   comments_disabled: false,
//   taken_at_timestamp: 1552738117,
//   edge_media_preview_like: { count: 0, edges: [] },
//   edge_media_to_sponsor_user: { edges: [] },
//   location: null,
//   viewer_has_liked: false,
//   viewer_has_saved: false,
//   viewer_has_saved_to_collection: false,
//   viewer_in_photo_of_you: false,
//   viewer_can_reshare: true,
//   owner:
//    { id: '11767775887',
//      is_verified: false,
//      profile_pic_url:
//       'https://scontent-arn2-2.cdninstagram.com/vp/189bbc2bef38111bed03b8e357820539/5D0993F5/t51.2885-19/53086904_404908416930948_8967016154899939328_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//      username: 'tohumoglu2013',
//      blocked_by_viewer: false,
//      followed_by_viewer: false,
//      full_name: 'Zeynep Tohumoğlu',
//      has_blocked_viewer: false,
//      is_private: false,
//      is_unpublished: false,
//      requested_by_viewer: false },
//   is_ad: false,
//   edge_web_media_to_related_media: { edges: [] } }

// video
// ig.scrapePostCode('BvEYyIxAeTM').then(function(result){
//     console.log(result);
// });

// { __typename: 'GraphVideo',
//   id: '2000833132961588428',
//   shortcode: 'BvEYyIxAeTM',
//   dimensions: { height: 421, width: 750 },
//   gating_info: null,
//   media_preview:
//    'ACoXit4U25Y5BGOOwbI/TPbrjikezgX5mc4PcYxkHGMc/X6Cp0kjCrG6gqBzjqTzjj2zVWQIybUBGT1JyOnQDHpz1/Olo1e7/r5CTu7EktvCAMOSSe+ACPXj14AqsixBgCCwB7Yx/KjA3huQCoBz6j/6/wCVTDb61lKSi7XbHcsRw2zHa3QHCgdSfc47mtA2MPqfzFZyGJcfMd+QSue3rikkZNx4HU9/eoUnbSUlqU3d6pFXcnfNNwrNnoB0A/r/APWooo2M9iXcKTcvpRRSELiP7wHzEDnn8f0xSZFFFFhn/9k=',
//   display_url:
//    'https://scontent-arn2-2.cdninstagram.com/vp/a1f47c7fcd74a29a6f2a109bad105d8c/5C9017BA/t51.2885-15/e15/52848280_431336814277849_205655832870151699_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//   display_resources:
//    [ { src:
//         'https://scontent-arn2-2.cdninstagram.com/vp/4ccf275e73c5d687c02435b8c61c24ec/5C8FACEC/t51.2885-15/e15/s640x640/52848280_431336814277849_205655832870151699_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//        config_width: 640,
//        config_height: 360 },
//      { src:
//         'https://scontent-arn2-2.cdninstagram.com/vp/a1f47c7fcd74a29a6f2a109bad105d8c/5C9017BA/t51.2885-15/e15/52848280_431336814277849_205655832870151699_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//        config_width: 750,
//        config_height: 421 },
//      { src:
//         'https://scontent-arn2-2.cdninstagram.com/vp/a1f47c7fcd74a29a6f2a109bad105d8c/5C9017BA/t51.2885-15/e15/52848280_431336814277849_205655832870151699_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//        config_width: 1080,
//        config_height: 607 } ],
//   dash_info:
//    { is_dash_eligible: false,
//      video_dash_manifest: null,
//      number_of_qualities: 0 },
//   video_url:
//    'https://scontent-arn2-2.cdninstagram.com/vp/7a482f7824ae4d7e285bea0cdd488056/5C8FC8E7/t50.2886-16/55551076_1998446707118116_5852988007136624640_n.mp4?_nc_ht=scontent-arn2-2.cdninstagram.com',
//   video_view_count: 41,
//   is_video: true,
//   should_log_client_event: false,
//   tracking_token:
//    'eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjpmYWxzZSwidXVpZCI6IjEyYmQ5YmY0ZTdiYjRkNDY4NGU4ZjE5MzFmYWFlMzQyMjAwMDgzMzEzMjk2MTU4ODQyOCJ9LCJzaWduYXR1cmUiOiIifQ==',
//   edge_media_to_tagged_user: { edges: [] },
//   edge_media_to_caption: { edges: [ [Object] ] },
//   caption_is_edited: true,
//   has_ranked_comments: false,
//   edge_media_to_comment:
//    { count: 2,
//      page_info: { has_next_page: false, end_cursor: null },
//      edges: [ [Object], [Object] ] },
//   comments_disabled: false,
//   taken_at_timestamp: 1552738125,
//   edge_media_preview_like: { count: 25, edges: [] },
//   edge_media_to_sponsor_user: { edges: [] },
//   location: null,
//   viewer_has_liked: false,
//   viewer_has_saved: false,
//   viewer_has_saved_to_collection: false,
//   viewer_in_photo_of_you: false,
//   viewer_can_reshare: true,
//   owner:
//    { id: '11636412255',
//      is_verified: false,
//      profile_pic_url:
//       'https://scontent-arn2-2.cdninstagram.com/vp/f88a54af04b273826b2002d617ed33c6/5D220A3E/t51.2885-19/s150x150/54277351_400384334073549_11861887922733056_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com',
//      username: 'teambarcq',
//      blocked_by_viewer: false,
//      followed_by_viewer: false,
//      full_name: 'Team Barcq[a] | 0,07k🇵🇱',
//      has_blocked_viewer: false,
//      is_private: false,
//      is_unpublished: false,
//      requested_by_viewer: false },
//   is_ad: false,
//   edge_web_media_to_related_media: { edges: [] },
//   encoding_status: null,
//   is_published: true,
//   product_type: 'feed',
//   title: '',
//   video_duration: 59.6,
//   thumbnail_src:
//    'https://scontent-arn2-2.cdninstagram.com/vp/5948456dfb1920a15f0a0975c0f95cfc/5C901A11/t51.2885-15/e15/c157.0.405.405/52848280_431336814277849_205655832870151699_n.jpg?_nc_ht=scontent-arn2-2.cdninstagram.com' }

