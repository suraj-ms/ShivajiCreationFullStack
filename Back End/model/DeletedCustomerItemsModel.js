const mongoose = require('mongoose');

const deletedCustomerItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  trialDate: { type: Date },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['new', 'cuttingDone', 'inProgress', 'ready', 'delivered'],
    default: 'new',
  },
  customer: { type: String, ref: 'Customer' }, // Assuming we use customer._id or a string as identifier
  deletedAt: { type: Date, default: Date.now, expires: '30d' }, // TTL set to 30 days
}, { timestamps: true });

module.exports = mongoose.model('DeletedCustomerItem', deletedCustomerItemSchema);
