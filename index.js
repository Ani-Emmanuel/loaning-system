const express = require('express');
const { dbConnection, testDbConnection } = require('./utils/db');
const cors = require('cors');
const routes = require('./routes');
const response = require('./utils/response');
require('dotenv').config();

const app = express();

if (process.env.NODE_ENV === 'test') {
	testDbConnection();
} else {
	dbConnection();
}

// Middlewares for service request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use(routes);

// middleware for handling file not found error
app.use((req, res, next) => {
	const err = new Error('Request not found');
	res.status(404).json(response.error(err, 404));
});

// middleware for handling all errors
app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;
	res.status(500).json(response.error(error, status));
});

module.exports = app;
