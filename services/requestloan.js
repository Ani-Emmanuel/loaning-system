const { Wallet } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');
const InterestCalculator = require('../utils/interestcalculator');
const { RATE } = require('../config');

//Request loan service
const RequestLoan = async ({ _id: userId, role }, req, res, next) => {
	try {
		if (role === 'user') {
			const { amount, duration } = req.body;
			if (!amount) {
				res
					.status(401)
					.json(errorResponse('Invalid request amount is required', 401));
			}
			const payload = {};
			payload.amount = amount;
			payload.duration = duration;
			payload.total = InterestCalculator(amount, RATE, duration);
			payload.userId = userId;
			const wallet = new Wallet(payload);
			const savedWallet = await wallet.save();
			res
				.status(201)
				.json(
					successResponse('request submitted successfully', savedWallet, 201)
				);
		} else {
			res.status(401).json(errorResponse('Sorry you should not be here', 401));
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { RequestLoan };
