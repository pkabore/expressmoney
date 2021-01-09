const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const APIKeySchema = new Schema({apikey: {type: mongoose.Types.ObjectId, default: new mongoose.Types.ObjectId()}}, { timestamps: true });


module.exports = mongoose.model("APIKey", APIKeySchema);