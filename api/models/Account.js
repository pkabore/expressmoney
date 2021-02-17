const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
	{
		name: {
			type: String,
			trim: true
		},
		tel: {
			unique: true,
			type: String,
			trim: true
		},
		email: {
			unique: true,
			type: String,
			trim: true
		},
		totalRequestedAmount: { type: Number, default: 0 },
		accountRegistrationCode: { type: String, default: 'something ...' },
		operationConfirmationCode: { type: String, default: '...' },
		passwordResetCode: { type: String, default: '...' },
		pwd: String,
		idUri: String,
		wcardUri: String,
		codcUri: String,
		updatingFile: String,
		city: {
			type: String,
			trim: true,
			default: ''
		},
		isAccountValidated: {
			type: String,
			default: ''
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Account', AccountSchema);
