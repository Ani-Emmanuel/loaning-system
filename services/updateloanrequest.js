const Loan = require('../models/wallet');
const { errorResponse, successResponse } = require('../utils/response');

const UpdateLoanRequest = async ({ _id }, req, res, next) => {
  try {
    
  } catch (error) {
    next(errorResponse(error.message, 501));
  }
};
