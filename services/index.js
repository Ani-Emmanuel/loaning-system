const { PayLoan } = require('./payloan');
const { RequestLoan } = require('./requestloan');
const { UpdateLoanRequest } = require('./updateloanrequest');
const {
	getAllRequests,
	getOneRequest,
	getAllDisburstLoan,
	getAllPaidLoan
} = require('./getrequest');
const {
	localRegistration,
	login,
	checkRole,
	verifyToken
} = require('./auth/authentication');
const { verifypayment } = require('./verifypayment');
module.exports = {
	PayLoan,
	RequestLoan,
	UpdateLoanRequest,
	getAllRequests,
	getOneRequest,
	localRegistration,
	login,
	checkRole,
	verifyToken,
	verifypayment,
	getAllDisburstLoan,
	getAllPaidLoan
};
