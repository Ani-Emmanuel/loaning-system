const InterestCalculator = (amount, rate, duration) => {
	return amount * rate * duration + amount;
};

module.exports = InterestCalculator;