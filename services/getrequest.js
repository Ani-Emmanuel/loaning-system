const { Loan } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');

//Get all loans
const getAllRequests = async ({ _id, role }, req, res, next) => {
	try {
		if (role === 'user') {
			const loan = await Loan.find({ userId: _id });
			return res.status(200).json(successResponse(null, loan, 200));
		}
		const loan = await Loan.find({});
		if (!loan.length) {
			return res.status(404).json(successResponse('No record fund', null, 404));
		}
		res.status(200).json(successResponse("success", loan, 200));
	} catch (error) {
		next(errorResponse(error.message, 500));
	}
};

//Get one loan
const getOneRequest = async ({ _id, role }, req, res, next) => {
	try {
		const loanId = req.params.id;

		//get the users own loan by the loggedin user
		if (role === 'user') {
			const loan = await Loan.findOne({ _id: loanId, userId: _id });
			if (!loan) {
				return res.status(404).json(errorResponse('Loan does not exist', 404));
			}
			return res.status(200).json(successResponse(null, loan, 200));
		}

		//Get the user loan by admin
		const loan = await Loan.findById({ _id: loanId });
		if (!loan) {
			return res.status(404).json(errorResponse('Loan does not exist', 404));
		}
		return res.status(200).json(successResponse(null, loan, 200));
	} catch (error) {
		next(errorResponse(error.message, 500));
	}
};

//Get all disbursted loan
const getAllDisburstLoan = async ({ _id, role }, req, res, next) => {
	try {
		const loan = await Loan.find({ status: 'DISBURSED' });
		if (!loan.length) {
			res
				.status(200)
				.json(successResponse(null, { message: 'No record fund' }, 200));
		}
		res.status(200).json(successResponse(null, loan, 200));
	} catch (error) {
		next(errorResponse(error.message, 500));
	}
};

//Get all paid loans
const getAllPaidLoan = async ({ _id, role }, req, res, next) => {
	try {
		const loan = await Loan.find({ paid: true });
		if (!loan.length) {
			res
				.status(404)
				.json(successResponse(null, { message: 'No record fund' }, 404));
		}
		res.status(200).json(successResponse(null, loan, 200));
	} catch (error) {
		next(errorResponse(error.message, 500));
	}
};
module.exports = {
	getAllRequests,
	getOneRequest,
	getAllDisburstLoan,
	getAllPaidLoan
};
