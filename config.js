require('dotenv').config();
const config = {
	PORT: process.env.PORT,
	DBURL: process.env.DBURL,
	TESTDBURL: process.env.TESTDBURL,
	SECRET: process.env.SECRET,
	PAYSTACKPUBLIC: process.env.PAYSTACKPUBLIC,
	PAYSTACKSECRET: process.env.PAYSTACKSECRET,
	RATE: process.env.RATE
};

module.exports = config;
