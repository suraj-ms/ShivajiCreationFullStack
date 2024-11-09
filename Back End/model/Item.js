const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now
  },
  trialDate: { type: Date },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['new', 'cuttingDone', 'inProgress', 'ready', 'delivered'], 
    default: 'new' 
  },
  customer: { 
    type: String, //changed from mongoose.Schema.Types.ObjectId to string 
    ref: 'Customer' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
