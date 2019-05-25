# FansInTears backend v1.0.0

Backend for FansInTears app

- [Fixture](#fixture)
	- [Get fixtures](#get-fixtures)
	
- [MediaContent](#mediacontent)
	- [Get media content](#get-media-content)
	


# Fixture

## Get fixtures

<p>Returns fixtures. By default returns fixtures in time range: &quot;now - 6 hours &lt;= now &lt;= now + 2 days&quot;</p>

	GET /fixtures


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| from			| Number			| **optional** <p>From unix timestamp</p>							|
| to			| Number			| **optional** <p>To unix timestamp</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
[
  {
      "_id": "5c81b3b6986149a3f58070e2",
      "id": 355,
      "__v": 0,
      "awayTeam": "Manchester United",
      "awayTeam_id": 33,
      "event_timestamp": 1552235400,
      "homeTeam": "Arsenal",
      "homeTeam_id": 42,
      "league_id": 2,
      "telegram_group_name": "ENG_ARS_MAN_FANSINTEARS",
      "telegram_invite_link": "https://t.me/joinchat/GdDWTRXLrxrAg9_sEpvS4g",
      "league": {
          "_id": "5c81b165986149a3f5805eab",
          "id": 2,
          "__v": 0,
          "country": "England",
          "country_code": "GB",
          "name": "Premier League",
          "season": "2018",
          "season_end": "2019-05-12",
          "season_start": "2018-08-10"
      }
  },
  {
      "_id": "5c81b483986149a3f5808077",
      "id": 37828,
      "__v": 0,
      "awayTeam": "Paris Saint Germain",
      "awayTeam_id": 85,
      "event_timestamp": 1552158000,
      "homeTeam": "Nantes",
      "homeTeam_id": 83,
      "league_id": 4,
      "telegram_group_name": "FRA_NAN_PAR_FANSINTEARS",
      "telegram_invite_link": "https://t.me/joinchat/GdDWTRXLrxrAg9_sEpvS4g",
      "league": {
          "_id": "5c81b165986149a3f5805eaf",
          "id": 4,
          "__v": 0,
          "country": "France",
          "country_code": "FR",
          "name": "Ligue 1",
          "season": "2018",
          "season_end": "2019-05-25",
          "season_start": "2018-08-10"
      }
  }
]
```
### Error Response

Error-Response:

```
HTTP/1.1 422 Unprocessable entity
```
Error-Response:

```
HTTP/1.1 500 Internal server error
```
# MediaContent

## Get media content

<p>Returns media content by group</p>

	GET /media/content

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| X-Total-Count			| String			|  <p>Response header. Total number of records.</p>							|
| X-Limit			| String			|  <p>Response header. Number of records per page.</p>							|
| X-Page-Last			| String			|  <p>Response header. Index of the past page. Pagination starts from page with index 0.</p>							|
| X-Page			| String			|  <p>Response header. Index of the current page. Pagination starts from page with index 0.</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| group			| String			|  <p>Media content group. Available values: 'memes' and 'players'.</p>							|
| page			| Number			| **optional** <p>Page number. Default: 0.</p>							|

### Success Response

Success-Response(memes):

```
HTTP/1.1 200 OK
[
  {
      "_id": "5ce96b65b5062e6bacc4f8e4",
      "url": "https://pbs.twimg.com/media/D7bH6i_UIAAWH8e.jpg",
      "__v": 0,
      "createdAt": 1558799247,
      "group": "memes",
      "mediaSource": "twitter",
      "mediaSourceUri": "TrollFootball",
      "profileAvatar": null,
      "profileFullName": "TrollFootball",
      "text": "OFFICIAL: Pep Guardiola unveiled as the new Juventus manager",
      "type": "photo"
  },
  {
      "_id": "5ce96b65b5062e6bacc4f93d",
      "url": "https://scontent.cdninstagram.com/vp/166819bcf2c47256785091fb5ee19f6a/5CEBFCCA/t50.2886-16/61727911_2713987785282562_2444701657934196060_n.mp4?_nc_ht=scontent.cdninstagram.com",
      "__v": 0,
      "createdAt": 1558791455,
      "group": "memes",
      "mediaSource": "instagram",
      "mediaSourceUri": "footballmemesinsta",
      "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/5150f7c3f30fa499375ce0cf2ba49232/5D689416/t51.2885-19/s150x150/53687215_311095812887779_1851112225763229696_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
      "profileFullName": "Football • Soccer • Fútbol",
      "text": "This is the best thing you’ll se all weekend",
      "type": "video"
  },
  {
      "_id": "5ce96b65b5062e6bacc4f965",
      "url": "https://scontent-frt3-2.cdninstagram.com/vp/9b249cc679a62edd00eed68a563f89ed/5D7D74C1/t51.2885-15/e35/60600023_2336658259943893_7393515027707347534_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
      "__v": 0,
      "createdAt": 1558791065,
      "group": "memes",
      "mediaSource": "instagram",
      "mediaSourceUri": "officialsoccermemes",
      "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/92d40c8cf638de53860991dcba9203f7/5D6788E3/t51.2885-19/s150x150/28764502_1936656559982894_8291188198877429760_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
      "profileFullName": "Soccer Memes",
      "text": "Only elites remember this derby..",
      "type": "photo"
  }
]
```
Success-Response(players):

```
HTTP/1.1 200 OK
[
  {
      "_id": "5ce96b65b5062e6bacc4fa7d",
      "url": "https://scontent-frt3-2.cdninstagram.com/vp/73265ce00cc37d36c995eb5e2e361d21/5D869611/t51.2885-15/sh0.08/e35/c0.179.1440.1440a/s640x640/60455430_110022136781972_1050194925618692924_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
      "__v": 0,
      "createdAt": 1558792059,
      "group": "players",
      "mediaSource": "instagram",
      "mediaSourceUri": "toni.kr8s",
      "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/21b37856c41b4b0cebd99114eeec4e93/5D9B13CC/t51.2885-19/s150x150/22802098_503478856676105_1612933203750813696_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
      "profileFullName": "Toni Kroos",
      "text": "Coming sooooooon! Very excited to present you the cover of my movie KROOS which will be released in Germany on July 4th! Love it! You too? // Ich freue mich sehr, euch das offizielle Cover zum Film KROOS zeigen zu dürfen, der am 4. Juli ins Kino kommt. Gefällt es euch ?",
      "type": "photo"
  },
  {
      "_id": "5ce92102c52f963c3b18fd48",
      "url": "https://scontent.cdninstagram.com/vp/4adde10d76c05734900e4146e0cf53ac/5CEB37FE/t50.2886-16/61073300_2540740436153145_8306512685139230720_n.mp4?_nc_ht=scontent.cdninstagram.com",
      "__v": 0,
      "createdAt": 1558731402,
      "group": "players",
      "mediaSource": "instagram",
      "mediaSourceUri": "karimbenzema",
      "profileAvatar": "https://scontent-frt3-2.cdninstagram.com/vp/be13818693e5eca9e3bfbcab0e4370e3/5D9BC87F/t51.2885-19/s150x150/49933498_368802787006598_1203420445877993472_n.jpg?_nc_ht=scontent-frt3-2.cdninstagram.com",
      "profileFullName": "Karim Benzema",
      "text": "Nueve",
      "type": "video"
  }
]
```
### Error Response

Error-Response:

```
HTTP/1.1 422 Unprocessable entity
```
Error-Response:

```
HTTP/1.1 500 Internal server error
```

