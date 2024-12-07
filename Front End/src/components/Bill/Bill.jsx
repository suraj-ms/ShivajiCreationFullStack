import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import './Bill.css';

function Bill() {
    const { orderNumber } = useParams();
    const [customerData, setCustomerData] = useState(null);
    const [itemPrices, setItemPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [advance, setAdvance] = useState(0);
    const [advances, setAdvances] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAdvancesListModal, setShowAdvancesListModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editAdvanceAmount, setEditAdvanceAmount] = useState(0);
    const [editAdvanceId, setEditAdvanceId] = useState(null);
    const [showCombinedEditModal, setShowCombinedEditModal] = useState(false);
    const [editData, setEditData] = useState({
        customerName: '',
        phoneNumber: '',
        itemsOrdered: [],
    });

    const [trialDate, setTrialDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [dateType, setDateType] = useState(''); // 'trial' or 'due'
    const [newTrialDate, setNewTrialDate] = useState(trialDate);
    const [newDueDate, setNewDueDate] = useState(dueDate);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);





    const loggedInUserName = localStorage.getItem('loggedInUserName');


    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await api.get(`/findOneCustomer/${orderNumber}`);

                setCustomerData(response.data.customer);
                setAdvances(response.data.customer.advances || []);
                setLoading(false);

                // Fetch the item prices
                const priceResponse = await api.get('/getItemPrice');
                setItemPrices(priceResponse.data);
            } catch (err) {
                setError('Failed to fetch customer data.');
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [orderNumber]);


    useEffect(() => {

        if (customerData?.itemsOrdered?.length > 0) {
            const firstItem = customerData.itemsOrdered[0];


            setTrialDate(firstItem.trialDate ? new Date(firstItem.trialDate).toISOString().split('T')[0] : '');
            setDueDate(firstItem.dueDate ? new Date(firstItem.dueDate).toISOString().split('T')[0] : '');
        }
    }, [customerData]);





    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const getItemPrice = (itemName) => {
        const item = itemPrices.find((price) => price.itemName === itemName);
        return item ? item.price : 0;
    };

    const calculateTotalPrice = () => {
        const total = customerData?.itemsOrdered
            .reduce((total, item) => {
                const itemPrice = getItemPrice(item.itemName);
                return total + itemPrice * item.quantity;
            }, 0)
            .toFixed(2);

        const totalAdvance = advances.reduce((sum, advance) => sum + advance.amount, 0).toFixed(2);

        return (total - totalAdvance).toFixed(2);
    };

    const handleAddAdvance = async () => {

        if (advance > 0) {
            const date = new Date().toISOString().split('T')[0];
            const editorName = loggedInUserName;

            console.log(`editorName ${editorName}`);


            try {
                const response = await api.post('/addAdvance', {
                    orderNumber: customerData._id,
                    amount: advance,
                    date,
                    editorName,
                });

                setAdvances([...advances, { amount: advance, date, editorName }]); // Add to the state
                setAdvance(0);
                setShowModal(false);
            } catch (err) {
                console.error('Error adding advance:', err);
            }
        }
    };


    const handleEditAdvance = async () => {
        if (editAdvanceAmount > 0 && editAdvanceId) {
            const editorName = loggedInUserName || 'Unknown User'; // Use the logged-in user's name

            try {
                await api.put('/updateAdvance', {
                    advanceId: editAdvanceId,
                    amount: editAdvanceAmount,
                    editorName, // Capture the editor name for updates
                });

                setAdvances(
                    advances.map((advance) =>
                        advance._id === editAdvanceId
                            ? { ...advance, amount: editAdvanceAmount, editorName }
                            : advance
                    )
                );
                setEditAdvanceAmount(0);
                setShowEditModal(false);
                setShowAdvancesListModal(false);
            } catch (err) {
                console.error('Error updating advance:', err);
            }
        }
    };



    const handleDeleteAdvance = async (advanceId) => {
        try {
            await api.delete(`/deleteAdvance/${advanceId}`);
            setAdvances(advances.filter((advance) => advance._id !== advanceId));
        } catch (err) {
            console.error('Error deleting advance:', err);
        }
    };


    const openCombinedEditModal = () => {
        setEditData({
            customerName: customerData?.customerName || '',
            phoneNumber: customerData?.phoneNumber || '',
            itemsOrdered: customerData?.itemsOrdered || [],
        });
        setShowCombinedEditModal(true);
    };

    const handleUpdateCustomerAndItems = async () => {
        try {
            const response = await api.put(`/updateCustomerAndItems/${customerData._id}`, {
                customerName: editData.customerName,
                phoneNumber: editData.phoneNumber,
                items: editData.itemsOrdered,
            });

            // Directly update the state without re-fetching
            setCustomerData({
                ...customerData,
                customerName: editData.customerName,
                phoneNumber: editData.phoneNumber,
                itemsOrdered: editData.itemsOrdered,
            });

            setShowCombinedEditModal(false); // Close the modal after successful update
        } catch (err) {
            console.error('Error updating customer and items:', err);
        }
    };


    const handleDeleteItem = async (itemId) => {
        try {
            const response = await api.delete(`/deleteItemFromCustomer/${customerData._id}/${itemId}`);
            console.log('Item deleted successfully:', response.data.message);

            // Update the state after deletion to reflect the UI
            setCustomerData({
                ...customerData,
                itemsOrdered: customerData.itemsOrdered.filter(item => item._id !== itemId),
            });
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    const handleUpdateItemDates = async (newTrialDate, newDueDate) => {
        try {
            const response = await api.put(`/updateItemDates/${customerData._id}`, {
                trialDate: newTrialDate,
                dueDate: newDueDate,
            });

            if (response.data.success) {
                // After successful API call, update the customerData state with the new dates
                setCustomerData({
                    ...customerData,
                    itemsOrdered: customerData.itemsOrdered.map(item => ({
                        ...item,
                        trialDate: newTrialDate,  // Update trialDate
                        dueDate: newDueDate,  // Update dueDate
                    })),
                });
            }
        } catch (err) {
            console.error('Error updating item dates:', err);
        }
    };





    return (
        <>
            <div className="cust_data">
                <div className="cust_data_item cust_ord_number">
                    <div>Order Number:</div>
                    {customerData?._id || 'N/A'}
                </div>
                <div className="cust_data_item cust_name">
                    <div>Name:</div>
                    {customerData?.customerName || 'N/A'}
                </div>
                <div className="cust_data_item cust_ph_no">
                    <div>Phone Number: </div>
                    {customerData?.phoneNumber || 'N/A'}
                </div>
            </div>
            <div className="date">
                <label htmlFor="">Trial Date</label>
                <input
                    className="trial_Date"
                    type="date"
                    value={trialDate}
                    onChange={(e) => {
                        const newTrialDate = e.target.value;
                        setDateType('trial');
                        setNewTrialDate(newTrialDate);
                        setShowConfirmation(true);  // Show the confirmation popup
                    }}
                />
                <label htmlFor="">Due Date</label>
                <input
                    className="due_Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                        const newDueDate = e.target.value;
                        setDateType('due');
                        setNewDueDate(newDueDate);
                        setShowConfirmation(true);  // Show the confirmation popup
                    }}
                />


            </div>

            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <h3>Are you sure you want to change the date?</h3>
                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    setShowConfirmation(false); // Hide the modal
                                    if (dateType === 'trial') {
                                        setTrialDate(newTrialDate); // Update the trial date
                                        handleUpdateItemDates(newTrialDate, dueDate); // Update item dates
                                    } else if (dateType === 'due') {
                                        setDueDate(newDueDate); // Update the due date
                                        handleUpdateItemDates(trialDate, newDueDate); // Update item dates
                                    }
                                }}
                            >
                                Yes, Save Changes
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmation(false); // Close the modal and do nothing
                                    // Optionally, revert the changes if needed
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}




            <div className="Advance_buttons">
                <button className="add-advance-button" onClick={() => setShowModal(true)}>
                    <ion-icon name="wallet-outline"></ion-icon>
                </button>
                {advances.length > 0 && (
                    <button
                        className="edit-advance-button"
                        onClick={() => setShowAdvancesListModal(true)}
                    >
                        <ion-icon name="cash-outline"></ion-icon>
                    </button>
                )}
                <button className="edit-user-button" onClick={openCombinedEditModal}>
                    <ion-icon name="create-outline"></ion-icon>
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Advance Payment</h2>
                        <label htmlFor="advanceInput">Advance Payment: </label>
                        <input
                            id="advanceInput"
                            type="number"
                            min="0"
                            value={advance}
                            onChange={(e) => setAdvance(parseFloat(e.target.value))}
                            placeholder="Enter advance amount"
                        />
                        <div className="modal-actions">
                            <button onClick={handleAddAdvance}>Add Advance</button>
                            <button onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showAdvancesListModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Advances Paid</h2>
                        <ul className="edit_advance">
                            {advances.map((advance, index) => (
                                <li className="edit_advance_item" key={index}>
                                    ₹{advance.amount} on {new Date(advance.date).toLocaleDateString()}
                                    <span className="editor-name">Edited by: {advance.editorName}</span> {/* Display editor's name */}
                                    <button
                                        className="edit_advance_edit_btn edit_advance_btn"
                                        onClick={() => {
                                            setEditAdvanceAmount(advance.amount);
                                            setEditAdvanceId(advance._id);  // Here you're setting the advanceId
                                            setShowEditModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="edit_advance_delete_btn edit_advance_btn"
                                        onClick={() => handleDeleteAdvance(advance._id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="modal-actions">
                            <button onClick={() => setShowAdvancesListModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}


            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Advance Payment</h2>
                        <label htmlFor="editAdvanceInput">New Advance Payment: </label>
                        <input
                            id="editAdvanceInput"
                            type="number"
                            min="0"
                            value={editAdvanceAmount}
                            onChange={(e) => setEditAdvanceAmount(parseFloat(e.target.value))}
                            placeholder="Enter new advance amount"
                        />
                        <div className="modal-actions">
                            <button onClick={handleEditAdvance}>Update Advance</button>
                            <button onClick={() => setShowEditModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showCombinedEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Customer</h2>
                        <div className="cust_edit_base_data">

                            <input
                                id="customerName"
                                type="text"
                                value={editData.customerName}
                                onChange={(e) =>
                                    setEditData({ ...editData, customerName: e.target.value })
                                }
                                placeholder="Enter customer name"
                            />


                            <input
                                id="phoneNumber"
                                type="text"
                                value={editData.phoneNumber}
                                onChange={(e) =>
                                    setEditData({ ...editData, phoneNumber: e.target.value })
                                }
                                placeholder="Enter phone number"
                            />

                        </div>
                        <h3>Items Ordered:</h3>
                        {editData.itemsOrdered.map((item, index) => (
                            <div className='edit_cust_item_data' key={index}>

                                <select
                                    value={item.itemName}
                                    onChange={(e) => {
                                        const updatedItems = [...editData.itemsOrdered];
                                        updatedItems[index].itemName = e.target.value;
                                        setEditData({ ...editData, itemsOrdered: updatedItems });
                                    }}
                                >
                                    <option value="">Select Item</option>
                                    {itemPrices.map((price) => (
                                        <option key={price.itemName} value={price.itemName}>
                                            {price.itemName}
                                        </option>
                                    ))}
                                </select>

                                <input className='edit_cust_item_quantity_data'
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const updatedItems = [...editData.itemsOrdered];
                                        updatedItems[index].quantity = parseInt(e.target.value, 10);
                                        setEditData({ ...editData, itemsOrdered: updatedItems });
                                    }}
                                />

                                {/* Delete Item Button */}
                                <button className='delete_edit_cust_item_btn'
                                    onClick={() => {
                                        const updatedItems = editData.itemsOrdered.filter((_, i) => i !== index);
                                        setEditData({ ...editData, itemsOrdered: updatedItems });
                                    }}
                                >
                                    <ion-icon name="close-outline"></ion-icon>
                                </button>
                            </div>
                        ))}

                        <div className="modal-actions">
                            {/* Add Item Button */}
                            <button
                                onClick={() => {
                                    const newItem = { itemName: '', quantity: 1 }; // Default values
                                    setEditData({
                                        ...editData,
                                        itemsOrdered: [...editData.itemsOrdered, newItem],
                                    });
                                }}
                            >
                                Add Item
                            </button>

                            <button onClick={handleUpdateCustomerAndItems}>Save Changes</button>
                            <button className='close_edit_popup' onClick={() => setShowCombinedEditModal(false)}><ion-icon name="close-outline"></ion-icon></button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-modal-content">
                        <h3>Are you sure you want to delete this item?</h3>
                        <div className="modal-actions">
                            <button
                                onClick={() => {
                                    if (itemToDelete) {
                                        handleDeleteItem(itemToDelete._id); // Proceed with deletion
                                    }
                                    setShowDeleteConfirmation(false); // Close the modal
                                }}
                            >
                                Yes, Delete Item
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirmation(false)} // Close the modal without doing anything
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <div className="table-container">
                <table className="items_table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Item Price</th>
                            <th>Total Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerData?.itemsOrdered.map((item) => (
                            <tr key={item._id}>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>{getItemPrice(item.itemName)}</td>
                                <td>{getItemPrice(item.itemName) * item.quantity}</td>
                                <td >
                                    <button
                                        className='delete_item_in_table'
                                        onClick={() => {
                                            setItemToDelete(item); // Store the item to be deleted
                                            setShowDeleteConfirmation(true); // Show the confirmation popup
                                        }}
                                    >
                                        Delete Item
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="total-price">
                    <strong>Total Price: </strong> &#8377; {calculateTotalPrice()}
                </div>

                <div className="total-advance">
                    <strong>Total Advance Paid: </strong> &#8377; {advances.reduce((sum, advance) => sum + advance.amount, 0).toFixed(2)}
                </div>
            </div>
            <div className="space">

            </div>
        </>
    );
}

export default Bill;
