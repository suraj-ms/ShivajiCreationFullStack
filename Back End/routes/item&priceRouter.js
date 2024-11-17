const express = require("express");

const { isLoggedIn, customRole } = require("../middlewares/UserMiddleware");
const {updateItemPrice, getAllItem, addItemPrice, deleteItem_and_PriceItem } = require("../controllers/item&priceController");

const router = express.Router();

router.route("/addItemPrice").post(isLoggedIn, customRole('admin'),addItemPrice); 
router.route("/getItemPrice").get(isLoggedIn, getAllItem); 
router.route("/editItemPrice/:itemId").put(isLoggedIn, customRole('admin'), updateItemPrice); 
router.route("/deleteItem_and_PriceItem/:id").delete(isLoggedIn, customRole('admin'), deleteItem_and_PriceItem); 

module.exports = router;