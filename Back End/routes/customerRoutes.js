
const express = require("express");
const { createCustomer, deleteCustomer, findOneCustomer, findMultipleCustomer, findCustomersByItemStatus, updateCustomer,
    updateCustomerItems, updateAndMoveDeliveredItems, revertQuantityToCustomer, findCustomerById, searchCustomers,
    addItemsToCustomer, deleteItemFromCustomer, updateItemStatus, addAdvance, deleteAdvance, editAdvance, updateCustomerAndItems,
    updateItemDates
} = require("../controllers/customerController")



const { isLoggedIn, customRole } = require("../middlewares/UserMiddleware");

const router = express.Router();

router.route("/addCustomer").post(isLoggedIn, customRole('manager', 'master', 'admin'), createCustomer);
router.route("/addItemsToCustomer/:customerId").post(isLoggedIn, customRole('manager', 'master', 'admin'), addItemsToCustomer);

router.route("/updateCustomer/:orderNumber").put(isLoggedIn, customRole('manager', 'master', 'admin'), updateCustomer);
router.route("/updateCustomerItems/:orderNumber").put(isLoggedIn, customRole('manager', 'master', 'admin'), updateCustomerItems);
router.route("/updateAndMoveDeliveredItems").put(isLoggedIn, customRole('manager', 'master', 'admin'), updateAndMoveDeliveredItems);
router.route("/revertQuantityToCustomer").put(isLoggedIn, customRole('manager', 'master', 'admin'), revertQuantityToCustomer);
router.route("/updateItemStatus").put(isLoggedIn, customRole('manager', 'master', 'admin'), updateItemStatus);
router.route("/updateCustomerAndItems/:customerId").put(isLoggedIn, customRole('manager', 'master', 'admin'), updateCustomerAndItems);
router.route("/updateItemDates/:customerId").put(isLoggedIn, customRole('manager', 'master', 'admin'), updateItemDates);

router.route("/deleteCustomer/:orderNumber").delete(isLoggedIn, customRole('manager', 'master', 'admin'), deleteCustomer);
router.route("/deleteItemFromCustomer/:customerId/:itemId").delete(isLoggedIn, customRole('manager', 'master', 'admin'), deleteItemFromCustomer);


router.route("/findOneCustomer/:orderNumber").get(isLoggedIn, findOneCustomer);
router.route("/findMultipleCustomer").get(isLoggedIn, findMultipleCustomer);
router.route("/findCustomersByItemStatus").get(isLoggedIn, findCustomersByItemStatus);
router.route("/findCustomerById/:id").get(isLoggedIn, findCustomerById);
router.route("/searchCustomers").get(isLoggedIn, searchCustomers);


router.route('/addAdvance').post(isLoggedIn, addAdvance)
router.route('/deleteAdvance/:advanceId').delete(isLoggedIn, deleteAdvance)
router.route('/updateAdvance').put(isLoggedIn, editAdvance)



module.exports = router;