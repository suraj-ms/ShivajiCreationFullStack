const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for item prices
const itemPriceSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
});

// Create the model from the schema
const ItemPrice = mongoose.model('ItemPrice', itemPriceSchema);

module.exports = ItemPrice;
