const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OperationSchema = new Schema(
	{
		sender_id: mongoose.Types.ObjectId,
		sender: {
			type: String,
			trim: true
		},
		amount: Number,
		fees: {
			type: Number,
			default: 0
		},
		currency: {
			type: String,
			default: 'FCFA',
			trim: true
		},
		status: {
			type: String,
			default: 'En cours'
		},
		rname: {
			type: String,
			trim: true
		},
		rnumber: {
			type: String,
			trim: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Operation', OperationSchema);
