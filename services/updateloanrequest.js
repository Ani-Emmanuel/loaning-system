const { Loan, User } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');

//Update loan
const UpdateLoanRequest = async (verifiedToken, req, res, next) => {
	try {
		const _id = req.params.id;
		const data = req.body.status;
		const loan = await Loan.findById({ _id });
		if (loan === null) {
			return res.status(404).json(errorResponse('Loan deos not exist', 404));
		}

		//makes sure that disbursed loans are not updated
		if (loan.status === 'DISBURSED') {
			return res
				.status(401)
				.json(errorResponse('Sorry you cannot update a disbursted loan', 401));
		}

		const updatedloan = await Loan.findByIdAndUpdate(
			_id,
			{
				$set: { status: data }
			},
			{ new: true, runValidators: true }
		);

		if (data === 'DISBURSED') {
			const user = await User.findOne({ _id: updatedloan.userId });
			return res
				.status(200)
				.json(
					successResponse(
						`loan of ${updatedloan.amount} paid to ${user.fullname} to be paid in ${updatedloan.duration} months`,
						updatedloan,
						200
					)
				);
		}
		res
			.status(200)
			.json(successResponse(`Loan upaded to ${data}`, updatedloan, 200));
	} catch (error) {
		next(errorResponse(error.message, 500));
	}
};

module.exports = { UpdateLoanRequest };
