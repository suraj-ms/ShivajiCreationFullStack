const mongoose = require('mongoose');

const deletedCustomerSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    itemsOrdered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    deletedAt: { type: Date, default: Date.now, expires: '1d' }, // TTL for 1 day (1 month = 30 days)
}, { timestamps: true });

module.exports = mongoose.model('DeletedCustomer', deletedCustomerSchema);
