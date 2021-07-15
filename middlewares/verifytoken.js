const { errorResponse, successResponse } = require('../utils/response');
const jwt = require('jsonwebtoken');

// Middleware that verifies Token
const verifyToken = async (req, res, next) => {
	let token;

	const tokenWithBearer = req.header('Authorization');
	if (tokenWithBearer) {
		token = tokenWithBearer.split(' ')[1];
	}

	if (!token) {
		return res
			.status(401)
			.json(errorResponse(`please login to perform this action`, 401));
	}

	try {
		const verifiedToken = jwt.verify(token, process.env.SECRET);

		if (!verifiedToken._id || !verifiedToken.role) {
			return res
				.status(401)
				.json(
					errorResponse(
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
				errorResponse(`${error}, please login to perform this action`, 401)
			);
	}
};

module.exports = { verifyToken };
