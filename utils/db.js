const mongoose = require('mongoose');
const { DBURL, TESTDBURL } = require('../config');

function dbConnection() {
	mongoose.connect(
		DBURL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		},
		(error) => {
			if (error) return new Error('Failed to connect to database');
			console.log('connected to live database');
		}
	);
}

function testDbConnection() {
	mongoose.connect(
		TESTDBURL,
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
