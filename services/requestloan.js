const { Loan, User } = require('../models');
const { errorResponse, successResponse } = require('../utils/response');
const InterestCalculator = require('../utils/interestcalculator');
const { RATE } = require('../config');

//Request loan service
const RequestLoan = async ({ _id: userId, role }, req, res, next) => {
	try {
		if (role === 'user') {
			const user = await User.findOne({ _id: userId });
			const loans = await Loan.find({ userId });

			//checks if user exists
			if (user === null) {
				return res.status(404).json({ message: 'User does not exist' });
			}

			//checks if you are eligible to take a loan
			if (loans.length) {
				for (let x = 0; x < loans.length; x++) {
					//checks if there is a loan that has been disbursed but not paid
					if (loans[x].status === 'DISBURSED' && !loans[x].paid) {
						return res.status(401).json({
							message: `you are not authorized to take another loan until you fully pay ${loans[x].total}`
						});
					}
					
					//checks if there is a loan that has not been disbursed
					if (
						loans[x].status !== 'DISBURSED' ||
						loans[x].status !== 'REJECTED'
					) {
						return res.status(401).json({
							message: `you have a loan in process`
						});
					}
				}
			}

			const { amount, duration } = req.body;
			if (!amount) {
				res
					.status(400)
					.json(errorResponse('Invalid request amount is required', 400));
			}
			const payload = {};
			payload.amount = amount;
			payload.duration = duration;
			payload.total = InterestCalculator(amount, RATE, duration);
			payload.userId = userId;
			const loan = new Loan(payload);
			const savedLoan = await loan.save();
			res
				.status(201)
				.json(
					successResponse('request submitted successfully', savedLoan, 201)
				);
		} else {
			res.status(401).json(errorResponse('Sorry you should not be here', 401));
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { RequestLoan };
