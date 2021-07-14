/*
System-wide API response convention
*/
module.exports = {
	successResponse: (message, data, statusCode) => {
		return {
			message,
			error: false,
			code: statusCode,
			data
		};
	},

	errorResponse: (message, statusCode) => {
		// List of common HTTP request code
		const codes = [200, 201, 400, 401, 404, 403, 422, 500];

		// Get matched code
		const findCode = codes.find((code) => code == statusCode);

		if (!findCode) {
			statusCode = 500;
		} else {
			statusCode = findCode;
		}

		return {
			message,
			code: statusCode,
			error: true
		};
	}
};
