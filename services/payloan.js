const { createHmac } = require('crypto');
const { Loan, User } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');
const { PAYSTACKSECRET } = require('../config');
const { initializePayment } = require('../utils/axios');

//pay loan service
const PayLoan = async ({ _id: userId, role }, req, res, next) => {
	try {
		const _id = req.params.id ? req.params.id : req.body.loanId;
		const { amount } = req.body;
		const loan = await Loan.findOne({ _id });

		if (!loan) {
			return res.status(404).json(errorResponse('Loan does not exist', 404));
		}

		if (loan.status !== 'DISBURSED') {
			return res
				.status(401)
				.json(errorResponse('You cannot Pay for undisbursed loan', 401));
		}

		const { email } = await User.findById({ _id: userId });

		const payload = {
			amount: amount * 100,
			email
		};

		const response = await initializePayment(payload, PAYSTACKSECRET);
		const { reference, authorization_url } = response;

		if (reference) {
			await Loan.findByIdAndUpdate({ _id }, { $set: { ref: reference } });
			return res.status(200).json({
				message: 'Please goto the link and pay',
				link: authorization_url
			});
		}

		if (!response) {
			res.status(400).json(errorResponse('Bad Request', 400));
		}
	} catch (error) {
		next(errorResponse(error.message, 500));
	}
};

module.exports = { PayLoan };
