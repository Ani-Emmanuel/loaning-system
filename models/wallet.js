const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function walletSchema() {
	return Schema(
		{
			amount: { type: Number, required: true },
			duration: { type: Number, required: true },
			total: { type: Number, default: 0 },
			ref: { type: String, default: null },
			paid: { type: Boolean, enum: [true, false], default: false },
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			status: {
				type: String,
				enum: {
					values: ['PENDING', 'ACCEPTED', 'REVIEWING', 'REJECTED', 'DISBURSED'],
					message: `{VALUE} is not supported: Use any of ['PENDING', 'ACCEPTED', 'REVIEWING', 'REJECTED', 'DISBURSED']`
				},
				default: 'PENDING'
			}
		},
		{ timestamps: { createdAt: 'created_at' } }
	);
}

module.exports = walletSchema;
