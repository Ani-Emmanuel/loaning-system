const { errorResponse, successResponse } = require('../utils/response');
const checkRole = (role) => {
	return (verifiedToken, req, res, next) => {
		try {
			if (!role.includes(verifiedToken.role)) {
				return res
					.status(401)
					.json(
						errorResponse(
							`You are not authorized to perform this action, please contact Admin`,
							401
						)
					);
			}

			return next(verifiedToken);
		} catch (error) {
			next(error)
		}
	};
};

module.exports = { checkRole };
