const BigPromise = require('../middlewares/bigPromise');
const Customer = require('../model/CustomerModel');
const Item = require('../model/Item');
const ItemPrice = require('../model/Item&Price');
const CustomError = require('../utils/CustomError ');
const OldCustomerOrder = require('../model/oldCustomerOrder');
const DeletedCustomer = require('../model/DeletedCustomerModel');
const DeletedCustomerItem = require('../model/DeletedCustomerItemsModel');



exports.createCustomer = BigPromise(async (req, res, next) => {
    const { customerName, phoneNumber, orderNumber, items } = req.body;

    const existingCustomer = await Customer.findById(orderNumber);
    if (existingCustomer) {
        return next(new CustomError(`Order number "${orderNumber}" already exists.`, 400));
    }

    if (!Array.isArray(items)) {
        return next(new CustomError('Items must be an array.', 400));
    }

    const newCustomer = new Customer({
        _id: orderNumber,
        customerName,
        phoneNumber,
    });

    const orderedItems = await Promise.all(items.map(async (item) => {
        const itemPrice = await ItemPrice.findOne({ itemName: item.itemName });
        if (!itemPrice) {
            return next(new CustomError(`Item "${item.itemName}" not found in ItemPrice collection.`, 404));
        }

        const newItem = new Item({
            item: itemPrice._id,
            itemName: itemPrice.itemName,
            quantity: item.quantity,
            orderDate: item.orderDate || Date.now(),
            trialDate: item.trialDate,
            dueDate: item.dueDate,
            status: item.status || 'new',
            customer: newCustomer._id,
        });

        return newItem.save();
    }));

    newCustomer.itemsOrdered = orderedItems.map(item => item._id);
    await newCustomer.save();

    const itemDetails = await Item.find({ _id: { $in: newCustomer.itemsOrdered } }).lean();

    return res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        customer: {
            ...newCustomer._doc,
            itemsOrdered: itemDetails,
        },
    });
});

// with out 1 month span 
// exports.deleteCustomer = BigPromise(async (req, res, next) => {
//     const { orderNumber } = req.params;

//     console.log(`orderNumber: ${orderNumber}`);

//     const customer = await Customer.findById(orderNumber);

//     if (!customer) {
//         return next(new CustomError(`No customer found with order number: ${orderNumber}`, 404));
//     }

//     const deleteItemsResult = await Item.deleteMany({ customer: customer._id });
//     if (deleteItemsResult.deletedCount === 0) {
//         console.log(`No items found for customer with order number: ${orderNumber}`);
//     }

//     await OldCustomerOrder.deleteMany({ customer: customer._id });

//     const deleteCustomerResult = await Customer.deleteOne({ _id: orderNumber });

//     if (deleteCustomerResult.deletedCount === 0) {
//         return next(new CustomError(`Failed to delete customer with order number: ${orderNumber}`, 500));
//     }

//     res.status(200).json({
//         success: true,
//         message: `Customer with order number ${orderNumber} and their items have been deleted.`,
//         deletedCustomer: customer,
//     });
// });



// with 1 month span
exports.deleteCustomer = BigPromise(async (req, res, next) => {
    const { orderNumber } = req.params;

    console.log(`orderNumber: ${orderNumber}`);

    // Find the customer by the provided order number (customer ID)
    const customer = await Customer.findById(orderNumber);

    if (!customer) {
        return next(new CustomError(`No customer found with order number: ${orderNumber}`, 404));
    }

    const deletedCustomerData = {
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber,
        itemsOrdered: customer.itemsOrdered,
    };

    const deletedCustomer = new DeletedCustomer(deletedCustomerData);
    await deletedCustomer.save();

    // Find all items associated with this customer
    const itemsToDelete = await Item.find({ customer: customer._id });

    const deletedItems = itemsToDelete.map(item => ({
        itemName: item.itemName,
        quantity: item.quantity,
        orderDate: item.orderDate,
        trialDate: item.trialDate,
        dueDate: item.dueDate,
        status: item.status,
        customer: item.customer,
    }));

    // Insert all deleted items into DeletedCustomerItems collection
    await DeletedCustomerItem.insertMany(deletedItems);

    // Delete associated items from the Item collection
    const deleteItemsResult = await Item.deleteMany({ customer: customer._id });
    if (deleteItemsResult.deletedCount === 0) {
        console.log(`No items found for customer with order number: ${orderNumber}`);
    }

    // Delete old customer orders
    await OldCustomerOrder.deleteMany({ customer: customer._id });

    // Delete the customer from the Customer collection
    const deleteCustomerResult = await Customer.deleteOne({ _id: orderNumber });

    if (deleteCustomerResult.deletedCount === 0) {
        return next(new CustomError(`Failed to delete customer with order number: ${orderNumber}`, 500));
    }

    // Respond with success message
    res.status(200).json({
        success: true,
        message: `Customer with order number ${orderNumber} and their items have been deleted, and the data is saved in the DeletedCustomer and DeletedCustomerItem collections.`,
        deletedCustomer: customer,
    });
});


exports.findOneCustomer = BigPromise(async (req, res, next) => {
    const { orderNumber } = req.params;

    console.log(`Fetching customer with order number: ${orderNumber}`);

    const customer = await Customer.findById(orderNumber).populate('itemsOrdered');

    if (!customer) {
        return next(new CustomError(`No customer found with order number: ${orderNumber}`, 404));
    }

    return res.status(200).json({
        success: true,
        message: 'Customer retrieved successfully.',
        customer,
    });
});


exports.findMultipleCustomer = BigPromise(async (req, res, next) => {
    const { orderNumbers } = req.body;

    if (!Array.isArray(orderNumbers) || orderNumbers.length === 0) {
        return next(new CustomError(`Invalid input: orderNumbers should be a non-empty array.`, 400));
    }

    const customers = await Customer.find({ _id: { $in: orderNumbers } })
        .populate({
            path: 'itemsOrdered',
            select: 'itemName quantity status',
        });

    if (customers.length === 0) {
        return next(new CustomError(`No customers found for the provided order numbers.`, 404));
    }

    const foundOrderNumbers = new Set(customers.map(customer => customer._id.toString()));

    const notFoundOrderNumbers = orderNumbers.filter(orderNumber => !foundOrderNumbers.has(orderNumber));

    const response = {
        customers,
        notFoundOrderNumbers: notFoundOrderNumbers.length > 0 ? notFoundOrderNumbers : null,
    };

    return res.status(200).json(response);
});


exports.findCustomersByItemStatus = BigPromise(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const items = await Item.find({
        status: { $in: ['new', 'cuttingDone', 'inProgress'] }
    }).select('_id');

    const itemIds = items.map(item => item._id);

    const customers = await Customer.find({
        itemsOrdered: { $in: itemIds }
    })
        .skip(skip)
        .limit(limit)
        .populate('itemsOrdered');

    const totalCount = await Customer.countDocuments({
        itemsOrdered: { $in: itemIds }
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
        customers,
    });
});


exports.updateCustomer = async (req, res) => {
    const { orderNumber } = req.params;
    const { customerName, phoneNumber } = req.body;

    try {
        const customer = await Customer.findById(orderNumber);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (customerName) customer.customerName = customerName;
        if (phoneNumber) customer.phoneNumber = phoneNumber;


        const updatedCustomer = await customer.save();


        res.status(200).json(updatedCustomer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCustomerItems = async (req, res) => {
    const { orderNumber } = req.params;
    const { itemsOrdered } = req.body;

    try {
        const customer = await Customer.findById(orderNumber);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (itemsOrdered && Array.isArray(itemsOrdered)) {
            const updatedItems = [];

            for (let itemData of itemsOrdered) {
                if (itemData._id) {
                    const item = await Item.findById(itemData._id);
                    if (!item) {
                        return res.status(404).json({ message: 'Item not found' });
                    }

                    if (item.customer && item.customer.toString() !== orderNumber) {
                        return res.status(400).json({ message: 'Item does not belong to this customer' });
                    }

                    item.itemName = itemData.itemName || item.itemName;
                    item.quantity = itemData.quantity || item.quantity;
                    item.status = itemData.status || item.status;
                    item.dueDate = itemData.dueDate || item.dueDate;

                    const updatedItem = await item.save();
                    updatedItems.push(updatedItem);
                } else {
                    const newItem = new Item({
                        ...itemData,
                        customer: orderNumber,
                    });

                    const savedNewItem = await newItem.save();
                    updatedItems.push(savedNewItem);
                }
            }

            customer.itemsOrdered = updatedItems;
            const updatedCustomer = await customer.save();

            res.status(200).json(updatedCustomer);
        } else {
            return res.status(400).json({ message: 'Invalid itemsOrdered data' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

};


// exports.updateAndMoveDeliveredItems = async (req, res) => {
//     try {
//         const { itemsOrdered } = req.body;

//         for (const itemTransfer of itemsOrdered) {
//             const { _id, quantity, status } = itemTransfer;

//             const item = await Item.findById(_id);
//             if (!item) {
//                 return res.status(404).json({ message: `Item with ID ${_id} not found` });
//             }

//             if (status === 'delivered' && quantity > 0 && item.quantity >= quantity) {
//                 console.log("Processing item with status 'delivered'");

//                 const oldOrder = new OldCustomerOrder({
//                     itemId: item._id,
//                     itemName: item.itemName,
//                     quantity,
//                     status,
//                     dueDate: item.dueDate,
//                 });
//                 await oldOrder.save();

//                 item.quantity -= quantity;
//                 await item.save();
//                 return res.status(200).json({ message: "Transfer successful" });
//             } else if (status === 'inProgress') {
//                 console.log("Item with status 'inProgress' - updating item status");

//                 // Handle the 'inProgress' item
//                 // For example, you might want to update its status or log something

//                 // If you want to process it the same way as 'delivered', or make any change:
//                 item.status = 'inProgress';  // Or any other update you need
//                 item.quantity -= quantity;  // Update quantity if necessary
//                 await item.save();

//                 return res.status(200).json({ message: "Item status updated to inProgress" });
//             } else {
//                 console.log("Item cannot be processed");

//                 return res.status(400).json({
//                     message: `Cannot transfer quantity of item with ID ${_id}: Check status or quantity.`,
//                     currentStatus: item.status,
//                     availableQuantity: item.quantity,
//                     requestedQuantity: quantity
//                 });
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error", error });
//     }
// };


exports.updateAndMoveDeliveredItems = async (req, res) => {
    try {
        const { itemsOrdered } = req.body;

        for (const itemTransfer of itemsOrdered) {
            const { _id, quantity, status } = itemTransfer;

            if (status !== 'delivered') {
                return res.status(400).json({
                    message: "Item status must be 'delivered' to update.",
                    currentStatus: status,
                });
            }

            const item = await Item.findById(_id);
            if (!item) {
                return res.status(404).json({ message: `Item with ID ${_id} not found` });
            }

            if (quantity <= 0 || item.quantity < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for item with ID ${_id}`,
                    currentQuantity: item.quantity,
                    requestedQuantity: quantity,
                });
            }

            item.status = 'delivered';
            item.quantity -= quantity;
            await item.save();

            const oldOrder = new OldCustomerOrder({
                itemId: item._id,
                itemName: item.itemName,
                quantity,
                status: 'delivered',
                dueDate: item.dueDate,
            });
            await oldOrder.save();

            return res.status(200).json({
                message: "Item status updated to 'delivered' and quantity adjusted.",
                item: {
                    itemId: item._id,
                    newQuantity: item.quantity,
                },
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


exports.revertQuantityToCustomer = async (req, res) => {
    try {
        const { itemId, quantityToRevert } = req.body;

        const [oldOrder, item] = await Promise.all([
            OldCustomerOrder.findOne({ itemId }),
            Item.findById(itemId)
        ]);

        if (!oldOrder) {
            return res.status(404).json({ message: `Old order with item ID ${itemId} not found` });
        }

        if (!item) {
            return res.status(404).json({ message: `Item with ID ${itemId} not found` });
        }

        if (quantityToRevert <= 0) {
            return res.status(400).json({ message: "Quantity to revert must be greater than 0." });
        }

        if (quantityToRevert > oldOrder.quantity) {
            return res.status(400).json({
                message: `Cannot revert quantity. Requested quantity exceeds available quantity in old order.`,
                oldOrderQuantity: oldOrder.quantity,
                requestedRevertQuantity: quantityToRevert
            });
        }

        item.quantity += quantityToRevert;
        await item.save();

        if (oldOrder.quantity === quantityToRevert) {
            await oldOrder.deleteOne();
            return res.status(200).json({
                message: "Quantity successfully reverted and old order removed."
            });
        }

        oldOrder.quantity -= quantityToRevert;
        await oldOrder.save();

        return res.status(200).json({ message: "Quantity successfully reverted to customer table." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};








// Shivaji_Creations
