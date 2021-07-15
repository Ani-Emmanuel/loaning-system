const { Wallet, User } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');
const { verifyPayment } = require('../utils/axios');
const { PAYSTACKSECRET } = require('../config');

//Verify payment service
const verifypayment = async ({ _id: userId, role }, req, res, next) => {
	try {
		const _id = req.params.id;

		//Makin sure its the User that took then loan verified it
		if (role === 'user') {
			const wallet = await Wallet.findOne({ _id, userId });
			if (wallet === null) {
				res.status(404).json(errorResponse('There is no Loan with ID', 404));
			}

			if (wallet.ref === null) {
				res.status(400).json(errorResponse('Loan has not been paid', 400));
			}

			const reference = wallet.ref;
			const data = await verifyPayment(reference, PAYSTACKSECRET);

			if (data.status === 'success') {
				await Wallet.findOneAndUpdate(
					{ _id, userId },
					{ $set: { paid: true } }
				);
				return res.status(200).json({ message: 'Load has been paid!!' });
			} else {
				return res
					.status(401)
					.json(errorResponse('Loan has not been paid', 401));
			}
		}

		//This is for the Admin
		const wallet = await Wallet.findOne({ _id, userId });
		if (wallet === null) {
			res.status(404).json(errorResponse('There is no Loan with ID', 404));
		}

		if (wallet.ref === null) {
			res.status(400).json(errorResponse('Loan has not been paid', 400));
		}

		const reference = wallet.ref;
		const data = await verifyPayment(reference, PAYSTACKSECRET);
		if (data.status === 'success') {
			await Wallet.findOneAndUpdate(
				{ _id, email: data.customer.email },
				{ $set: { paid: true } }
			);
			return res.status(200).json({ message: 'Load has been paid!!' });
		} else {
			return res.status(401).json(errorResponse('Loan has not been paid', 401));
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { verifypayment };
