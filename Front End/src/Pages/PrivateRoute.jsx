// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    return (
      <>
        <Navbar /> {/* Render the Navbar */}
        {element} {/* Render the passed element */}
      </>
    );
  }

  return <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
