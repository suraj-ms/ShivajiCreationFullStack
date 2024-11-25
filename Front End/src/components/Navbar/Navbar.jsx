import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import config from '../../utils/config ';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: 'Employee', path: '/login' },
    { label: 'Logout', path: '#', onClick: handleLogout, isButton: true },
  ];

  return (
    
    
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      <div className="brand">{config.appTitle}</div>
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>
      <ul className="navList">
        {navItems.map((item, index) => (
          <li className="navItem" key={index}>
            {item.isButton ? (
              <button onClick={item.onClick} className="logoutButton">{item.label}</button>
            ) : (
              <Link to={item.path} className="navLink">{item.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
    
  );
};

export default Navbar;
