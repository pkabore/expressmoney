const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
	{
		accounts: {
			type: Number,
			default: 0
		},
		operations: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Notification', NotificationSchema);
