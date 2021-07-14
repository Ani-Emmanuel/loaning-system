const mongoose = require('mongoose');
const { LocalConfig } = require('./config');

function dbConnection() {
	const DB_URL = LocalConfig.DB_URL;
	mongoose.connect(
		DB_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
			useCreateIndex: true
		},
		(error) => {
			if (error) return new Error('Failed to connect to database');
			console.log('connected to live database');
		}
	);
}

function testDbConnection() {
	const DB_URL = LocalConfig.TEST_DB_URL;
	mongoose.connect(
		DB_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
			useCreateIndex: true
		},
		(error) => {
			if (error) return new Error('Failed to connect to database');
			console.log('connected to test database');
		}
	);
}

module.exports = {
	dbConnection,
	testDbConnection
};
