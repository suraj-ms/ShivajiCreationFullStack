import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const PrivateRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return (
    <>
    
      <Navbar />
      {element}
    </>
  );
};

export default PrivateRoute;
