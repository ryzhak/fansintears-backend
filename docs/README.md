# FansInTears backend v1.0.0

Backend for FansInTears app

- [Fixture](#fixture)
	- [Get fixtures](#get-fixtures)
	


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

