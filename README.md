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
- update json dumps for all leagues (league ids: England - 2, France - 4, Germany - 8, Italy - 94, Russia - 135, Spain - 87)
- run `node scripts/update-calendar.js`