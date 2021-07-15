const { Wallet } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');

//Get all loans
const getAllRequests = async ({ _id, role }, req, res, next) => {
	try {
		if (role === 'user') {
			const wallet = await Wallet.find({ userId: _id });
			res.status(200).json(successResponse(null, wallet, 200));
		}
		const wallet = await Wallet.find({});
		res.status(200).json(successResponse(null, wallet, 200));
	} catch (error) {
		next(error);
	}
};

//Get one loan
const getOneRequest = async ({ _id, role }, req, res, next) => {
	try {
		const walletId = req.params.id;

		//get the users own loan by the loggedin user
		if (role === 'user') {
			const wallet = await Wallet.findOne({ _id: walletId, userId: _id });
			if (!wallet) {
				return res.status(404).json(errorResponse('Loan does not exist', 404));
			}
			return res.status(200).json(successResponse(null, wallet, 200));
		}

		//Get the user loan by admin
		const wallet = await Wallet.findById({ _id: walletId });
		if (!wallet) {
			return res.status(404).json(errorResponse('Loan does not exist', 404));
		}
		return res.status(200).json(successResponse(null, wallet, 200));
	} catch (error) {
		next(error);
	}
};

//Get all disbursted loan
const getAllDisburstLoan = async ({ _id, role }, req, res, next) => {
	try {
		const wallet = await Wallet.find({ status: 'DISBURSED' });
		if (!wallet.length) {
			res
				.status(200)
				.json(successResponse(null, { message: 'No record fund' }, 200));
		}
		res.status(200).json(successResponse(null, wallet, 200));
	} catch (error) {
		next(error);
	}
};

//Get all paid loans
const getAllPaidLoan = async ({ _id, role }, req, res, next) => {
	try {
		const wallet = await Wallet.find({ paid: true });
		if (!wallet.length) {
			res
				.status(200)
				.json(successResponse(null, { message: 'No record fund' }, 200));
		}
		res.status(200).json(successResponse(null, wallet, 200));
	} catch (error) {
		next(error);
	}
};
module.exports = {
	getAllRequests,
	getOneRequest,
	getAllDisburstLoan,
	getAllPaidLoan
};
