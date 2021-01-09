const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OperationSchema = new Schema({
	sender_id: mongoose.Types.ObjectId,
	sender: {
		type: String,
		trim: true
	},
	amount: Number,
	currency: {
		type: String,
		trim: true
	},
	status: {
		type: String,
		default: "En cours"
	},
	rname: {
		type: String,
		trim: true
	},
	rnumber: {
		type: String,
		trim: true
	}
}, {
	timestamps: true
})


module.exports = mongoose.model("Operation", OperationSchema);