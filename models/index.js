const mongoose = require('mongoose');
const userSchema = require('./user');
const walletSchema = require('./wallet');

module.exports = {
	User: mongoose.model('User', userSchema()),
	Wallet: mongoose.model('Wallet', walletSchema())
};
