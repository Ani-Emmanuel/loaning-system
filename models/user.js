const Mongoose = require('mongoose');
const Schema = new Mongoose.Schema();

function userSchemas() {
	return Schema({
		fullname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: { type: String, default: 'user' },
		wallet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Wallet',
			default: null
		},
		password: { type: String, required: true }
	});
}

module.exports = userSchemas;
