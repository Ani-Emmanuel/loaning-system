const axios = require('axios');
const initializePayment = async (payload, PAYSTACKSECRET) => {
	try {
		axios.defaults.headers.common['Authorization'] = `Bearer ${PAYSTACKSECRET}`;
		const response = await axios({
			method: 'post',
			url: 'https://api.paystack.co/transaction/initialize',
			data: payload,
			validateStatus: () => true
		});

		const { data } = response.data;
		return JSON.parse(JSON.stringify(data));
	} catch (error) {
		throw error;
	}
};

const verifyPayment = async (reference, PAYSTACKSECRET) => {
	try {
		axios.defaults.headers.common['Authorization'] = `Bearer ${PAYSTACKSECRET}`;
		const response = await axios({
			method: 'get',
			url: `https://api.paystack.co/transaction/verify/${reference}`,
			validateStatus: () => true
		});

		const { data } = response.data;
		return JSON.parse(JSON.stringify(data));
	} catch (error) {
		throw error;
	}
};

module.exports = { initializePayment, verifyPayment };
