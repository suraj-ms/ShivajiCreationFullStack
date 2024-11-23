import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Navbar.css'; // Import CSS for the navbar


const Navbar = () => {
    
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.succes) {
        
        localStorage.removeItem('token');
        
        navigate('/login');
      } else {

        console.error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
      <div className="navbar-container">
        <h1>My Application</h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/home">Home</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
