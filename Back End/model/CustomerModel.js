const mongoose = require('mongoose');
const Item = require('./Item');

const customerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    required: true, 
    // match: [/^\d{10}$/, 'Please enter a valid phone number'] 
  },
  itemsOrdered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  advances: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, required: true },
      editorName: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Customers', customerSchema);
