// models/OldCustomerOrder.js
const mongoose = require('mongoose');

const oldCustomerOrderSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, required: true },
  dueDate: { type: Date },
  transferDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('OldCustomerOrder', oldCustomerOrderSchema);
