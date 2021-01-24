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
		pwd: String,
		status: String,
		idUri: String,
		wcardUri: String,
		codcUri: String,
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
