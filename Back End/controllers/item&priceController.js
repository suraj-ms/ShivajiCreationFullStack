const BigPromise = require("../middlewares/bigPromise");
const ItemPrice = require("../model/Item&Price");
const CustomError = require("../utils/CustomError ");
const cookieToken = require("../utils/cookieToken");


exports.addItemPrice = async (req, res) => {

  const { itemName, price } = req.body;

  let existingItem = await ItemPrice.findOne({ itemName });

  if (existingItem) {
    return res.status(400).json({
      success: false,
      message: "Item already exists. Use the update endpoint to modify the price.",
    });
  }

  const itemPrice = await ItemPrice.create({
    itemName,
    price,
  });

  res.status(201).json({
    success: true,
    message: "Item and price added successfully",
    itemPrice,
  });

};


exports.getAllItem = async (req, res) => {
  try {
    const items = await ItemPrice.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}




exports.updateItemPrice = async (req, res) => {
    
    const { itemId } = req.params;
    const { itemName, price } = req.body;
    let itemPrice = await ItemPrice.findById(itemId);

    if (!itemPrice) {
      return res.status(404).json({
        success: false,
        message: "Item not found. Use the add endpoint to create a new item.",
      });
    }

    if (itemName) itemPrice.itemName = itemName;
    if (price) itemPrice.price = price;

    await itemPrice.save();

    res.status(200).json({
      success: true,
      message: "Item price updated successfully",
      itemPrice,
    });
};


exports.deleteItem_and_PriceItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    const result = await ItemPrice.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

