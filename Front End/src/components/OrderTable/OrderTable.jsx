import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './OrderTable.css';
import api from '../../utils/api';

function OrderTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // For row popup

  const [showItemPopup, setShowItemPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState('');

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

  const paginatedData = data.slice((page - 1) * limit, page * limit);

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
                Earliest Due Date
                {sortOrder === 'asc' ? ' 🔼' : ' 🔽'}
              </th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((customer, index) => (
              <tr key={index} onClick={() => handleRowClick(customer)}>
                <td data-label="Order Number">{customer._id}</td>
                <td data-label="Customer Name">{customer.customerName}</td>
                <td
                  data-label="Items"
                  onClick={(e) => {
                    e.stopPropagation();
                  }} // Prevent row click on item click
                >
                  {customer.itemsOrdered.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <span
                        className={`status-badge ${getStatusClass(item.status)}`}
                        onClick={() => handleItemClick(item)}
                      >
                        {`${item.quantity} ${
                          itemAbbreviations[item.itemName] || item.itemName.slice(0, 2).toUpperCase()
                        }`}
                      </span>
                    </div>
                  ))}
                </td>
                <td data-label="Earliest Due Date">
                  {formatDate(
                    Math.min(...customer.itemsOrdered.map((item) => new Date(item.dueDate).getTime()))
                  )}
                </td>
                <td data-label="Phone Number">{customer.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {/* Popup for row navigation */}
      {showPopup && selectedRow && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Order Options</h3>
            <button onClick={() => handleNavigate('measurement')}>Measurement</button>
            <button onClick={() => handleNavigate('bill')}>Bill</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Popup for editing item status */}
      {showItemPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Edit Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="new">New</option>
              <option value="cuttingDone">Cutting Done</option>
              <option value="inProgress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
            <div>
              <button onClick={() => setShowItemPopup(false)}>Update</button>
              <button onClick={() => setShowItemPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTable;
