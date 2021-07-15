const { Wallet } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');

//Update loan 
const UpdateLoanRequest = async (verifiedToken, req, res, next) => {
	try {
		const _id = req.params.id;
		const data = req.body.status;
		const wallet = await Wallet.findByIdAndUpdate(
			_id,
			{
				$set: { status: data }
			},
			{ new: true, runValidators: true }
		);
		res.status(200).json(successResponse('Update successful', wallet, 200));
	} catch (error) {
		next(error.message);
	}
};

module.exports = { UpdateLoanRequest };
