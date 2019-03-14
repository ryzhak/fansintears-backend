# FansInTears backend

## How to run backend

### Setup config
Create `config.js` file in the project root:
```
module.exports = {
	BOT_TOKEN: '123:abc', // telegram bot token
	MONGO_CONNECTION_STRING: 'mongodb://localhost:27017/db_name', // mongo db connection string
	SERVER_PORT: 8080 // api server port
};
```

## How to update calendar in DB
- update json dumps for all leagues
- run `node scripts/update-calendar.js`