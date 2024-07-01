const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeadVendorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    presetLeadVendorLeadResultGroupId: {
        type: Number,
        default: null
    },
}, { timestamps: true });

const LeadVendor = mongoose.model('LeadVendor', LeadVendorSchema);

module.exports = LeadVendor;
