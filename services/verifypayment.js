const { Loan, User } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');
const { verifyPayment } = require('../utils/axios');
const { PAYSTACKSECRET } = require('../config');

//Verify payment service
const verifypayment = async ({ _id: userId, role }, req, res, next) => {
	try {
		const _id = req.params.id;

		//Making sure its the User that took then loan verifies it
		if (role === 'user') {
			const loan = await Loan.findOne({ _id, userId });
			if (loan === null) {
				return res
					.status(404)
					.json(errorResponse('There is no Loan with the ID', 404));
			}

			if (loan.ref === null) {
				return res
					.status(400)
					.json(errorResponse('Loan has not been paid', 400));
			}

			const reference = loan.ref;
			const data = await verifyPayment(reference, PAYSTACKSECRET);

			if (data.status === 'success') {
				let totalAmountPaid = Number(loan.refunds) + Number(data.amount / 100);
				let payment = await Loan.findOneAndUpdate(
					{ _id, userId },
					{ $set: { refunds: totalAmountPaid, ref: null } },
					{ new: true }
				);

				if (payment.refunds >= loan.total) {
					await Loan.findOneAndUpdate(
						{ _id, userId },
						{ $set: { paid: true } }
					);
					return res.status(200).json({ message: 'Loan fully paid' });
				}
				return res.status(200).json({
					message: `you have made ${data.amount / 100} of ${loan.total}`
				});
			} else {
				return res
					.status(400)
					.json(errorResponse('Loan has not been paid', 400));
			}
		}

		//This is for the Admin
		const loan = await Loan.findOne({ _id, userId });
		if (loan === null) {
			return res
				.status(404)
				.json(errorResponse('There is no Loan with ID', 404));
		}

		if (loan.ref === null) {
			return res.status(400).json(errorResponse('Loan has not been paid', 400));
		}

		const reference = loan.ref;
		const data = await verifyPayment(reference, PAYSTACKSECRET);
		if (data.status === 'success') {
			let totalAmountPaid = Number(loan.refunds) + Number(data.amount / 100);
			let payment = await Loan.findOneAndUpdate(
				{ _id, email: data.customer.email },
				{ $set: { refunds: totalAmountPaid, ref: null } },
				{ new: true }
			);

			if (payment.refunds >= loan.total) {
				await Loan.findOneAndUpdate(
					{ _id, email: data.customer.email },
					{ $set: { paid: true } }
				);
				return res.status(200).json({ message: 'Loan fully paid' });
			}

			return res.status(200).json({
				message: `you have made ${data.amount / 100} of ${loan.total}`
			});
		} else {
			return res.status(400).json(errorResponse('Loan has not been paid', 400));
		}
	} catch (error) {
		next(errorResponse(error.message, 500));
	}
};

module.exports = { verifypayment };
