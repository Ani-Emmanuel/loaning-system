const mongoose = require('mongoose');
const userSchema = require('./user');
const loanSchema = require('./loan');

module.exports = {
	User: mongoose.model('User', userSchema()),
	Loan: mongoose.model('Loan', loanSchema())
};
