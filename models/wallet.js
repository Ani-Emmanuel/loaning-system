const Mongoose = require('mongoose');
const Schema = new Mongoose.Schema();

function walletSchema() {
	return Schema(
		{
			amount: { type: String, required: true },
			status: { type: String, default: 'PENDING' },
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true
			}
		},
		{ timestamps: { createdAt: 'created_at' } }
	);
}

module.exports = walletSchema;
