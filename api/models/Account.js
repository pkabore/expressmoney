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
		tempoEmail: { type: String },
		totalRequestedAmount: { type: Number, default: 0 },
		accountRegistrationCode: { type: String, default: 'default' },
		operationConfirmationCode: { type: String, default: 'default' },
		passwordResetCode: { type: String, default: 'default' },
		passwordResetCodeExpires: { type: Date },
		emailChangeCode: { type: String, default: 'default' },
		pwd: String,
		idUri: String,
		wcardUri: String,
		codcUri: String,
		updatingFile: { type: String, default: '' },
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
