const { User } = require('../../models');
const { errorResponse, successResponse } = require('../../utils/response');
const {
	genToken,
	decryptPassword,
	encryptPassword
} = require('../../utils/helper');

module.exports = {
	//Registration service
	localRegistration: async (req, res, next) => {
		try {
			const { body } = req;
			const { email } = req.body;

			// Checks if user already exist in the database
			const user = await User.findOne({ email });

			if (user) {
				return res
					.status(423)
					.json(
						errorResponse(
							'User already exist, please login or use forget password',
							423
						)
					);
			}

			// Perform the hashing of the password and saving the new user
			const newuser = new User(body);
			const { password } = newuser;
			const hashedPassword = await encryptPassword(password);
			newuser.password = hashedPassword;
			const data = await newuser.save();

			//Generate token to log user in
			const token = await genToken(data._id, data.role);
			return res.status(201).json(
				successResponse(
					null,
					{
						fullName: data.fullName,
						token
					},
					201
				)
			);
		} catch (error) {
			next(errorResponse(error.message, 500));
		}
	},

	//Login services
	login: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });

			if (user != null) {
				const pass = await decryptPassword(password, user.password);
				if (!pass) {
					return res
						.status(401)
						.json(errorResponse('Invalid username or password', 401));
				}

				const token = await genToken(user._id, user.role);
				return res
					.status(200)
					.json(successResponse(null, { token, fullName: user.fullName }, 200));
			} else {
				return res.json(errorResponse('User does not exist', 404));
			}
		} catch (error) {
			next(errorResponse(error.message, 500));
		}
	}
};
