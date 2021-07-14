const { User } = require('../model');
const { creatWallet } = require('../services/');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const {
	genToken,
	decryptPassword,
	encryptPassword
} = require('../utils/helper');

module.exports = {
	localRegistration: async (req, res, next) => {
		try {
			const { body } = req;
			const { email } = req.body;

			// Checks if user already exist in the database

			const user = await User.findOne({ email, status: 'active' });

			if (user) {
				return res
					.status(401)
					.json(
						response.error(
							'User already exist, please login or use forget password',
							401
						)
					);
			}

			// Perform the hashing of the password and saving the new user
			const newuser = new User(body);
			const { password } = newuser;
			const hashedPassword = await encryptPassword(password);
			newuser.password = hashedPassword;
			const data = await newuser.save();

			// Create a wallet for the new user
			const wallet = await creatWallet({
				accountReference: ObjectId().toString(),
				accountName: data.fullName,
				currencyCode: 'NGN',
				contractCode: '3782379693',
				customerEmail: data.email,
				userId: data._id
			});

			data.wallet = wallet;
			data.save();

			//Generate token to log user in
			const token = await genToken(data._id, data.role);
			return res.status(201).json(
				response.success(
					null,
					{
						fullName: data.fullName,
						token,
						_id: data._id
					},
					201
				)
			);
		} catch (error) {
			console.log(error);
			next(error);
		}
	},

	login: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });

			if (user != null) {
				const pass = await decryptPassword(password, user.password);
				if (!pass) {
					return res
						.status(422)
						.json(response.error('Invalid username or password', 422));
				}

				const token = await genToken(user._id, user.role);
				return res
					.status(200)
					.json(
						response.success(
							null,
							{ token, fullName: user.fullName, _id: user._id },
							200
						)
					);
			} else {
				return res.json(response.error('User does not exist', 404));
			}
		} catch (error) {
			next(error);
		}
	},

	// Middleware that verifies Token
	verifyToken: async (req, res, next) => {
		let token;

		const tokenWithBearer = req.header('Authorization');
		if (tokenWithBearer) {
			token = tokenWithBearer.split(' ')[1];
		}

		if (!token) {
			return res
				.status(401)
				.json(response.error(`please login to perform this action`, 401));
		}

		try {
			const verifiedToken = jwt.verify(token, process.env.SECRET);

			if (!verifiedToken._id || !verifiedToken.role) {
				return res
					.status(401)
					.json(
						response.error(
							'Invalid Token, please login to perform this action',
							401
						)
					);
			}

			next(verifiedToken);
		} catch (error) {
			return res
				.status(401)
				.json(
					response.error(`${error}, please login to perform this action`, 401)
				);
		}
	},

	checkRole: (role) => {
		return (verifiedToken, req, res, next) => {
			try {
				if (!role.includes(verifiedToken.role)) {
					return res
						.status(401)
						.json(
							response.error(
								`You are not authorized to perform this action, please contact Admin`,
								401
							)
						);
				}

				return next(verifiedToken);
			} catch (error) {
				return res
					.status(401)
					.json(
						response.error(
							`${error}, Something happened please contact the Admin`,
							401
						)
					);
			}
		};
	}
};
