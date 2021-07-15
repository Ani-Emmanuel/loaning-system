const { createHmac } = require('crypto');
const { Wallet, User } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');
const { PAYSTACKSECRET } = require('../config');
const { initializePayment } = require('../utils/axios');

//pay loan service
const PayLoan = async ({ _id: userId, role }, req, res, next) => {
	try {
		const _id = req.params.id ? req.params.id : req.body.walletId;
		const { amount } = req.body;
		const wallet = await Wallet.findOne({ _id });

		if (!wallet) {
			return res.status(404).json(errorResponse('Loan does nt exist', 404));
		}

		if (wallet.status !== 'DISBURSED') {
			return res
				.status(401)
				.json(errorResponse('You cannot Pay for undisbursed loan', 401));
		}

		if (amount < wallet.total) {
			return res
				.status(401)
				.json(
					errorResponse(
						`Amount ${amount} is less than what you are owing: ${wallet.total}`,
						401
					)
				);
		}

		const { email } = await User.findById({ _id: userId });

		const total = amount;
		const payload = {
			amount: wallet.total * 100,
			email
		};

		const response = await initializePayment(payload, PAYSTACKSECRET);
		const { reference, authorization_url } = response;

		if (reference) {
			await Wallet.findByIdAndUpdate({ _id }, { $set: { ref: reference } });
			return res.status(200).json({
				message: 'Please goto the link and pay',
				link: authorization_url
			});
		}

		if (!response) {
			res.status(401).json(errorResponse('Bad Request', 401));
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { PayLoan };
