import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './OrderTable.css';
import api from '../../utils/api'; // Assuming an API helper for making requests

function OrderTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false); // For row popup
  const [selectedRow, setSelectedRow] = useState(null); // For row popup
  const [showItemPopup, setShowItemPopup] = useState(false); // For item status popup
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for status update
  const [newStatus, setNewStatus] = useState(''); // New status for selected item

  const navigate = useNavigate(); // For navigation

  const itemAbbreviations = {
    Shirt: 'Sh',
    Pant: 'P',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'status-new';
      case 'ready':
        return 'status-ready';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-default';
    }
  };

  const fetchData = async (query = '') => {
    setLoading(true);
    setError(null);

    try {
      let url = '/findCustomersByItemStatus';
      if (query) {
        url = `/searchCustomers?query=${query}&page=${page}&limit=${limit}`;
      }

      const response = await api.get(url);
      const validatedData = response.data.customers.map((customer) => ({
        ...customer,
        itemsOrdered: Array.isArray(customer.itemsOrdered) ? customer.itemsOrdered : [],
      }));

      setData(validatedData);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchData(query);
  };

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(Math.min(...a.itemsOrdered.map((item) => new Date(item.dueDate).getTime())));
      const dateB = new Date(Math.min(...b.itemsOrdered.map((item) => new Date(item.dueDate).getTime())));

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setNewStatus(item.status);
    setShowItemPopup(true);
  };

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      const response = await api.put('/updateItemStatus', { itemId, status: newStatus });

      if (response.status === 200) {
        const updatedItem = response.data.item;

        // Update the local state to reflect the new status
        const updatedData = data.map((customer) => ({
          ...customer,
          itemsOrdered: customer.itemsOrdered.map((item) =>
            item._id === itemId ? { ...item, status: updatedItem.status } : item
          ),
        }));

        setData(updatedData);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setShowItemPopup(false);
    }
  };

  const handleRowClick = (customer) => {
    setSelectedRow(customer);
    setShowPopup(true);
  };

  const handleNavigate = (destination) => {
    if (!selectedRow) return;

    if (destination === 'measurement') {
      navigate(`/measurement/${selectedRow._id}`);
    } else if (destination === 'bill') {
      navigate(`/bill/${selectedRow._id}`);
    }

    setShowPopup(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return (
    <div className="orderTable-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by customer name, phone, item name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : data.length > 0 ? (
        <table className="orderTable">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer Name</th>
              <th>Items</th>
              <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                Earliest Due Date {sortOrder === 'asc' ? ' 🔼' : ' 🔽'}
              </th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer, index) => (
              <tr key={index} onClick={() => handleRowClick(customer)}>
                <td>{customer._id}</td>
                <td>{customer.customerName}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {customer.itemsOrdered.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <span
                        className={`status-badge ${getStatusClass(item.status)}`}
                        onClick={() => handleItemClick(item)}
                      >
                        {`${item.quantity} ${itemAbbreviations[item.itemName] || item.itemName.slice(0, 2).toUpperCase()}`}
                      </span>
                    </div>
                  ))}
                </td>
                <td>
                  {formatDate(
                    Math.min(...customer.itemsOrdered.map((item) => new Date(item.dueDate).getTime()))
                  )}
                </td>
                <td>{customer.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <span>Page {page}</span>
        <button disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
          Next
        </button>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {/* Row Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Order Options</h3>
            <button onClick={() => handleNavigate('measurement')}>Measurement</button>
            <button onClick={() => handleNavigate('bill')}>Bill</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Status Popup */}
      {showItemPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Edit Status</h3>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="new">New</option>
              <option value="cuttingDone">Cutting Done</option>
              <option value="inProgress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
            <div>
              <button onClick={() => updateItemStatus(selectedItem._id, newStatus)}>Update</button>
              <button onClick={() => setShowItemPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTable;
