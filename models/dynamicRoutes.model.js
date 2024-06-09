const { Schema, model, default: mongoose } = require('mongoose');

const dynamicRoutesScheme = new Schema({
	identityID: { type: mongoose.Schema.Types.ObjectId, required: true },
	pathName: { type: String, required: true, unique: true }
});

const dynamicRouteModel = model('dynamicRoute', dynamicRoutesScheme);

module.exports = dynamicRouteModel;
