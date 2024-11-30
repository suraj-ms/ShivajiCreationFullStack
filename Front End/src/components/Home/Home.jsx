import React, { useState } from 'react';
import OrderTable from '../OrderTable/OrderTable';
import './Home.css';
import AddCustPopup from '../AddCustPopup/AddCustPopup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleAddCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]); // Add new customer
    setShowPopup(false); // Close popup after customer is added
  };

  return (
    <div className='homePage'>
      <OrderTable customers={customers} />
      <button className='add_cust' onClick={() => setShowPopup(true)}>
        <ion-icon name="person-add-outline"></ion-icon>
      </button>

      {showPopup && (
        <>
          <div className="overlay" onClick={() => setShowPopup(false)}></div>
          <AddCustPopup 
            className='add_cust_popup'
            onClose={() => setShowPopup(false)} // Close popup when onClose is triggered
            onSubmit={handleAddCustomer}
          />
        </>
      )}
    </div>
  );
};

export default Home;
