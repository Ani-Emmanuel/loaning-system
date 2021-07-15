const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function userSchemas() {
	return Schema({
		fullname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: { type: String, enum: ['user', 'admin'], required: true },
		password: { type: String, required: true }
	});
}

module.exports = userSchemas;
