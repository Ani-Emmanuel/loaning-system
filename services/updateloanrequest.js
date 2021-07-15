const { Wallet, User } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');

//Update loan
const UpdateLoanRequest = async (verifiedToken, req, res, next) => {
	try {
		const _id = req.params.id;
		const data = req.body.status;
		const loan = await Wallet.findById({ _id });
		if (loan === null) {
			return res.status(404).json(errorResponse('Loan deos not exist', 404));
		}

		//makes sure that disbursed loans are not updated
		if (loan.status === 'DISBURSED') {
			return res
				.status(404)
				.json(errorResponse('Sorry you cannot update a disbursted loan', 404));
		}

		const wallet = await Wallet.findByIdAndUpdate(
			_id,
			{
				$set: { status: data }
			},
			{ new: true, runValidators: true }
		);

		if (data === 'DISBURSED') {
			const user = await User.findOne({ _id: loan.userId });
			res
				.status(200)
				.json(
					successResponse(
						`loan of ${loan.amount} paid to ${user.fullname} to be paid in ${loan.duration} months`,
						wallet,
						200
					)
				);
		}
		res
			.status(200)
			.json(successResponse(`Loan upaded to ${data}`, wallet, 200));
	} catch (error) {
		next(error.message);
	}
};

module.exports = { UpdateLoanRequest };
