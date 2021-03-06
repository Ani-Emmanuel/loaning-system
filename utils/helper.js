const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function for encrypting the password before saving
const encryptPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(12);
		const hashedPass = await bcrypt.hash(password, salt);
		return hashedPass;
	} catch (error) {
		return error;
	}
};

// Function for decrypting hashed password and compare for login
const decryptPassword = async (password, hashedPass) => {
	try {
		const operationResult = await bcrypt.compare(password, hashedPass);
		return operationResult;
	} catch (error) {
		return error;
	}
};

// Function for Generation token
const genToken = async (id, role) => {
	try {
		const token = await jwt.sign({ _id: id, role: role }, process.env.SECRET, {
			expiresIn: 60 * 60
		});
		return token;
	} catch (error) {
		return error;
	}
};

module.exports = {
	encryptPassword,
	decryptPassword,
	genToken
};
