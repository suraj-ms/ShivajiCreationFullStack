import React, { useState, useEffect } from 'react';
import './AddCustPopup.css';
import api from '../../utils/api';

const AddCustPopup = ({ onClose, onSubmit }) => {
    const [customerName, setCustomerName] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [items, setItems] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [trialDate, setTrialDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableItems, setAvailableItems] = useState([]);  // To store the item options from the API
    const [loadingItems, setLoadingItems] = useState(true);  // Loading state for fetching items

    // Fetch available items from the API when the component mounts
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/getItemPrice');
                if (response.status === 200) {
                    // Extract the itemNames from the response
                    const itemNames = response.data.map(item => item.itemName);
                    setAvailableItems(itemNames);  // Store only the itemNames in availableItems
                }
            } catch (error) {
                console.error('Failed to fetch items. Please try again later.');
            } finally {
                setLoadingItems(false);  // End loading state
            }
        };

        fetchItems();
    }, []);

    const addItem = () => {
        setItems([...items, { status: 'new', itemName: 'Select Any', quantity: 1 }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (!customerName || !orderNumber || !phoneNumber) {
            console.error('Please fill in all required fields and add at least one item.');
            return;
        }

        const newCustomer = {
            customerName,
            orderNumber,
            phoneNumber,
            items: items.map((item) => ({
                itemName: item.itemName,
                quantity: item.quantity,
                dueDate: dueDate,
                trialDate: trialDate,
                status: 'new',
            })),
        };

        setIsSubmitting(true);

        try {
            const response = await api.post('/addCustomer', newCustomer);

            if (response.status === 200) {
                onSubmit(newCustomer);
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                const errorMessage = error.response.data.message;
                console.log('Unauthorized access:', errorMessage);
                alert("You are not allowed the add customer please connect with higer management to add customer");
            } else {
                console.error(error || 'Failed to add customer. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add_cust_popup">
            <div className="add_cust_popup_content">
                <h2>Add New Customer</h2>
                <div className="cust_details">
                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Order Number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <h3>Items</h3>
                {items.map((item, index) => (
                    <div key={index} className="item">
                        <select
                            className="item_drop_down"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        >
                            <option value="Select Any">Select Any</option>
                            {loadingItems ? (
                                <option>Loading items...</option>
                            ) : (
                                availableItems.map((itemName, idx) => (
                                    <option key={idx} value={itemName}>
                                        {itemName}
                                    </option>
                                ))
                            )}
                        </select>
                        <input
                            className="quantity"
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        />
                        <button className="remove_item_btn" onClick={() => removeItem(index)}>
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                    </div>
                ))}
                <div className="dates">

                    <label htmlFor="">Trail Date</label>
                    <input
                        type="date"
                        value={trialDate}
                        onChange={(e) => setTrialDate(e.target.value)}
                        placeholder="Trial Date"
                    />
                    <label htmlFor="">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="Due Date"
                    />
                </div>
                <button onClick={addItem} className="add_item_btn operation_btn">
                    Add Item
                </button>
                <button
                    className="submit_btn operation_btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button onClick={onClose} className="close_btn">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
        </div>
    );
};

export default AddCustPopup;
