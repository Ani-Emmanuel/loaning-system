const Loan = require('../models/wallet');
const { errorResponse, successResponse } = require('../utils/response');

const RequestLoan = async ({ _id }, req, res, next) => {
	try {
		const { amount } = req.body;
		if (!amount) {
			res
				.status(401)
				.json(errorResponse('Invalid request amount is required', 401));
		}
		const payload = {};
		payload.amount = amount;
		payload.userId = _id;
		const wallet = new Loan(payload);
		const savedWallet = await wallet.save();
		res
			.status(201)
			.json(
				successResponse('request submitted successfully', savedWallet, 201)
			);
	} catch (error) {
		next(errorResponse(error.message, 501));
	}
};

module.exports = RequestLoan;