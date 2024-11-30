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

    useEffect(() => {
        if (customerData) return; // Prevent fetch if data is already set

        const fetchCustomerData = async () => {
            try {
                const response = await api.get(`/findOneCustomer/${orderNumber}`);
                console.log(response.data.customer);

                setCustomerData(response.data.customer);
                setLoading(false);

                // Fetch item prices
                const priceResponse = await api.get('/getItemPrice');
                setItemPrices(priceResponse.data);
            } catch (err) {
                setError('Failed to fetch customer data.');
                setLoading(false);
                console.error('Failed to fetch customer data.');
            }
        };

        fetchCustomerData();
    }, [orderNumber, customerData]); // Adding orderNumber and customerData as dependencies

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Function to get the price of an item based on its name
    const getItemPrice = (itemName) => {
        const item = itemPrices.find((price) => price.itemName === itemName);
        return item ? item.price : 0;
    };

    // Calculate the total price of all items
    const calculateTotalPrice = () => {
        return customerData?.itemsOrdered
            .reduce((total, item) => {
                const itemPrice = getItemPrice(item.itemName); // Use the fetched price
                return total + itemPrice * item.quantity;
            }, 0)
            .toFixed(2); // Return total price with 2 decimal points
    };

    // Format the bill details into a message
    const formatBillMessage = () => {
        let message = `Bill Details for Order #${customerData._id}\n`;
        message += `Customer: ${customerData.customerName}\n`;
        message += `Phone: ${customerData.phoneNumber}\n`;
        message += `Items Ordered:\n`;

        customerData.itemsOrdered.forEach(item => {
            const itemPrice = getItemPrice(item.itemName);
            const totalPrice = itemPrice * item.quantity;
            message += `${item.itemName} - Quantity: ${item.quantity}, Price: ₹${itemPrice}, Total: ₹${totalPrice}\n`;

            // Including trial date and due date for only the first item
            if (customerData.itemsOrdered[0]._id === item._id) { // For the first item in the list
                message += `Trial Date: ${item.trialDate ? new Date(item.trialDate).toLocaleDateString() : 'N/A'}\n`;
                message += `Due Date: ${new Date(item.dueDate).toLocaleDateString()}\n`;
            }
        });

        message += `\nTotal Price: ₹${calculateTotalPrice()}`;
        return message;
    };

    // Function to send the bill via WhatsApp
    const sendBillToWhatsApp = () => {
        const phoneNumber = customerData.phoneNumber; // Assuming phoneNumber is in correct format
        const message = formatBillMessage();
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
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

            {/* Display trial and due dates for only the first item */}
            <div>
                {customerData?.itemsOrdered[0] && (
                    <div className="date">
                        <div>
                            <label className='date_item' htmlFor="trialDate">Trial Date:</label>
                            <input
                                id="trialDate"
                                className="trial_date date_item"
                                type="date"
                                value={customerData.itemsOrdered[0].trialDate ? new Date(customerData.itemsOrdered[0].trialDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleTrialDateChange(e.target.value)}  // Update this function to handle changes
                            />
                        </div>
                        <div>
                            <label className='date_item' htmlFor="dueDate">Due Date:</label>
                            <input
                                id="dueDate"
                                className="due_date date_item" 
                                type="date"
                                value={customerData.itemsOrdered[0].dueDate ? new Date(customerData.itemsOrdered[0].dueDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleDueDateChange(e.target.value)}  // Update this function to handle changes
                            />
                        </div>
                    </div>
                )}
            </div>


            {/* Display the table with item details */}
            <div className="table-container">
                <table className="items_table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Item Price</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerData?.itemsOrdered.map((item) => {
                            const itemPrice = getItemPrice(item.itemName); // Get price based on item name
                            const totalPrice = itemPrice * item.quantity;

                            return (
                                <tr key={item._id}>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{itemPrice}</td>
                                    <td>{totalPrice}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Display the total price at the bottom */}
                <div className="total-price">
                    <strong>Total Price: </strong> &#8377; {calculateTotalPrice()}
                </div>
            </div>

            {/* Send Bill Button */}
            <div className="send_bill" onClick={sendBillToWhatsApp}>
                <ion-icon name="logo-whatsapp"></ion-icon>
            </div>
        </>
    );
}

export default Bill;
