const express = require('express');
const { dbConnection, testDbConnection } = require('./utils/db');
const cors = require('cors');
const { route } = require('./routes/routes');
const { errorResponse } = require('./utils/response');
require('dotenv').config();
const { PORT } = require('./config');

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
app.use(route);

// middleware for handling file not found error
app.use((req, res, next) => {
	const err = new Error('Request not found');
	res.status(404).json(errorResponse(err, 404));
});

// middleware for handling all errors
app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;
	res.status(500).json(errorResponse(error, status));
});

app.listen(PORT || 3000, () => console.log(`server started on port ${PORT}`));
// module.exports = app;
