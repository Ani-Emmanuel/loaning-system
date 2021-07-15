const { Router } = require('express');
const { verifyToken, checkRole } = require('../middlewares');
const {
	PayLoan,
	UpdateLoanRequest,
	getAllRequests,
	getOneRequest,
	RequestLoan,
	localRegistration,
	login,
	verifypayment,
	getAllDisburstLoan,
	getAllPaidLoan
} = require('../services');

const route = Router();

//route for requesting for loan
route.post('/api/v1/requestloan', [verifyToken, checkRole(['user'])], RequestLoan);

//route for updating for loan
route.patch(
	'/api/v1/updateloan/:id',
	[verifyToken, checkRole(['admin'])],
	UpdateLoanRequest
);

//route for getting one loan
route.get(
	'/api/v1/oneloan/:id',
	[verifyToken, checkRole(['user', 'admin'])],
	getOneRequest
);

//route for all loans
route.get(
	'/api/v1/allloans',
	[verifyToken, checkRole(['user', 'admin'])],
	getAllRequests
);

//route for all loans
route.get(
	'/api/v1/disburstedloans',
	[verifyToken, checkRole(['admin'])],
	getAllDisburstLoan
);

//route for all loans
route.get(
	'/api/v1/paidloans',
	[verifyToken, checkRole(['admin'])],
	getAllPaidLoan
);

//route for registration
route.post('/api/v1/register', localRegistration);

//route for login
route.post('/api/v1/login', login);

//route for the webhook
route.get(
	'/api/v1/verifypayment/:id',
	[verifyToken, checkRole(['user', 'admin'])],
	verifypayment
);

//route for paying loan
route.post('/api/v1/payloan/:id', [verifyToken, checkRole(['user'])], PayLoan);
// route.post('/payloan', PayLoan)

module.exports = { route };
