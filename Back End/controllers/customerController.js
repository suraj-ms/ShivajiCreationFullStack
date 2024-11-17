const BigPromise = require('../middlewares/bigPromise');
const Customer = require('../model/CustomerModel');
const Item = require('../model/Item');
const ItemPrice = require('../model/Item&Price');
const OldCustomerOrder = require('../model/oldCustomerOrder');
const DeletedCustomer = require('../model/DeletedCustomerModel');
const DeletedCustomerItem = require('../model/DeletedCustomerItemsModel');

const mongoose = require('mongoose');



exports.createCustomer = BigPromise(async (req, res, next) => {
    const { customerName, phoneNumber, orderNumber, items } = req.body;

    const existingCustomer = await Customer.findById(orderNumber);
    if (existingCustomer) {
        return res.status(409).json({ success: false, message: `Order number "${orderNumber}" already exists.` });
    }

    if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, message: `Items must be an array.` });
    }

    const newCustomer = new Customer({
        _id: orderNumber,
        customerName,
        phoneNumber,
    });

    const orderedItems = await Promise.all(items.map(async (item) => {
        const itemPrice = await ItemPrice.findOne({ itemName: item.itemName });
        if (!itemPrice) {
            return res.status(404).json({ success: false, message: `Item "${item.itemName}" not found in ItemPrice collection` });
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

// with 1 month span
exports.deleteCustomer = BigPromise(async (req, res, next) => {
    const { orderNumber } = req.params;

    console.log(`orderNumber: ${orderNumber}`);

    // Find the customer by the provided order number (customer ID)
    const customer = await Customer.findById(orderNumber);

    if (!customer) {
        return res.status(404).json({ success: false, message: `No customer found with order number: ${orderNumber}` });
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
        return res.status(500).json({ success: false, message: `Failed to delete customer with order number:` });
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
        return res.status(404).json({ success: false, message: `No customer found with order number: ${orderNumber}` });
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
        return res.status(400).json({ success: false, message: `Invalid input: orderNumbers should be a non-empty array` });
    }

    const customers = await Customer.find({ _id: { $in: orderNumbers } })
        .populate({
            path: 'itemsOrdered',
            select: 'itemName quantity status',
        });

    if (customers.length === 0) {
        return res.status(404).json({ success: false, message: `No customers found for the provided order numbers.` });
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
    try {
        const { orderNumber } = req.params;
        const { updateData } = req.body;

        if (!orderNumber) {
            return res.status(400).json({ message: 'Order number is required' });
        }

        if (!updateData) {
            return res.status(400).json({ message: 'Update data is required' });
        }

        const items = await Item.find({ customer: orderNumber });

        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found for this order number' });
        }

        const updatedItems = await Item.updateMany(
            { customer: orderNumber },
            { $set: updateData },
            { new: true }
        );

        res.status(200).json(updatedItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while updating the items', error: err.message });
    }

};



exports.updateAndMoveDeliveredItems = async (req, res) => {
    const { items } = req.body;
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      for (const itemData of items) {
        const { itemId, customerId, quantity } = itemData;
  
        const item = await Item.findById(itemId).session(session);
        if (!item) {
          throw new Error(`Item with id ${itemId} not found`);
        }
  
        if (item.quantity < quantity) {
          throw new Error(`Not enough quantity of item ${itemId} to deliver`);
        }
  
        item.quantity -= quantity;
        await item.save({ session });
  
        let oldOrder = await OldCustomerOrder.findOne({
          item: item._id,
          customer: customerId,
        }).session(session);
  
        if (oldOrder) {
          oldOrder.quantity += quantity;
          await oldOrder.save({ session });
        } else {
          // When creating a new order, include the itemName
          const oldCustomerOrder = new OldCustomerOrder({
            item: item._id,
            itemName: item.itemName,  // Send item name here
            customer: customerId,
            quantity,
            status: 'delivered',
          });
          await oldCustomerOrder.save({ session });
        }
  
        if (item.quantity === 0) {
          await item.deleteOne({ session });
        }
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({
        message: 'Items updated, old orders recorded, and items deleted successfully',
      });
  
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(500).json({ message: 'An error occurred while processing the request', error: err.message });
    }
  };
  




  exports.revertQuantityToCustomer = async (req, res) => {
    const { items } = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        for (const itemData of items) {
            const { itemId, customerId, quantityToRevert } = itemData;

            const oldOrder = await OldCustomerOrder.findOne({
                item: itemId,
                customer: customerId
            }).session(session);

            if (!oldOrder) {
                throw new Error(`No order found for item ${itemId} and customer ${customerId}`);
            }

            if (oldOrder.quantity < quantityToRevert) {
                throw new Error(`Cannot revert more quantity than was ordered. Available: ${oldOrder.quantity}`);
            }

            let item = await Item.findById(itemId).session(session);

            if (item) {
                item.quantity += quantityToRevert;
                item.status = 'new';
                await item.save({ session });
            } else {
                if (!oldOrder.itemName) {
                    throw new Error('Item name is missing in OldCustomerOrder');
                }

                item = new Item({
                    _id: itemId,
                    itemName: oldOrder.itemName,
                    quantity: quantityToRevert,
                    status: 'new',
                });
                await item.save({ session });
            }

            oldOrder.quantity -= quantityToRevert;

            if (oldOrder.quantity === 0) {
                await oldOrder.deleteOne({ session });
            } else {
                await oldOrder.save({ session });
            }
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Items reverted and updated successfully',
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing the request', error: err.message });
    }
};



exports.findCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;



        // Find the customer by their _id
        const customer = await Customer.findById(customerId).populate('itemsOrdered'); // Assuming you want to populate itemsOrdered

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        return res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.searchCustomers = async (req, res) => {
    try {
        const searchQuery = req.query.query || ''; // Default to empty string if no query is provided
        const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is specified
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if no limit is specified

        // Calculate skip and limit values for pagination
        const skip = (page - 1) * limit;

        // Search query to find customers
        const customers = await Customer.find({
            $or: [
                { customerName: { $regex: searchQuery, $options: 'i' } },         // Case-insensitive search on customerName
                { phoneNumber: { $regex: searchQuery, $options: 'i' } },           // Case-insensitive search on phoneNumber
                { 'itemsOrdered.itemName': { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on item names
                { _id: { $regex: searchQuery, $options: 'i' } }  // Convert _id to string for partial match
            ]
        })
            .skip(skip)  // Skip the number of documents based on pagination
            .limit(limit)  // Limit the number of documents per page
            .populate('itemsOrdered');  // Populate itemsOrdered if necessary

        // Get total count of customers matching the search query (for pagination)
        const totalCount = await Customer.countDocuments({
            $or: [
                { customerName: { $regex: searchQuery, $options: 'i' } },
                { phoneNumber: { $regex: searchQuery, $options: 'i' } },
                { 'itemsOrdered.itemName': { $regex: searchQuery, $options: 'i' } },
                { _id: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

        return res.status(200).json({
            customers,
            totalPages,
            currentPage: page,
            totalCount
        });
    } catch (error) {
        console.error('Error searching customers:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addItemsToCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const itemsData = req.body;

        if (!Array.isArray(itemsData) || itemsData.length === 0) {
            return res.status(400).json({ message: 'You must provide an array of items' });
        }

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const existingItems = await Item.find({
            customer: customerId,
            itemName: { $in: itemsData.map(item => item.itemName) }
        });

        if (existingItems.length > 0) {
            const existingItemNames = existingItems.map(item => item.itemName);
            return res.status(400).json({
                message: 'Some items already exist for this customer',
                existingItems: existingItemNames
            });
        }

        const newItems = itemsData.map(item => ({
            itemName: item.itemName,
            quantity: item.quantity,
            status: item.status || 'new',
            trialDate: item.trialDate,
            dueDate: item.dueDate,
            customer: customerId,
        }));

        const createdItems = await Item.insertMany(newItems);

        await Customer.findByIdAndUpdate(
            customerId,
            { $push: { itemsOrdered: { $each: createdItems.map(item => item._id) } } },
            { new: true }
        );

        res.status(201).json(createdItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while adding the items', error: err.message });
    }

};


exports.deleteItemFromCustomer = async (req, res) => {
    try {
        const { customerId, itemId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.customer.toString() !== customerId) {
            return res.status(400).json({ message: 'This item does not belong to the specified customer' });
        }

        await Customer.findByIdAndUpdate(
            customerId,
            { $pull: { itemsOrdered: itemId } },
            { new: true }
        );

        await Item.findByIdAndDelete(itemId);

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting the item', error: err.message });
    }
};
