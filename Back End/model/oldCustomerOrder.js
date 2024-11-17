const mongoose = require('mongoose');

const oldCustomerOrderSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true 
  },
  itemName: { 
    type: String, 
    required: true 
  },
  customer: { 
    type: String, 
    ref: 'Customer', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['delivered'], 
    required: true 
  },
  deliveryDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('OldCustomerOrder', oldCustomerOrderSchema);
