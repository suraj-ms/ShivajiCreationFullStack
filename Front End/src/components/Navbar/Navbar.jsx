import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import config from '../../utils/config';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');

    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const role = localStorage.getItem('role');

  const navItems = [
    { label: 'Employee', path: '/login' },
    { label: 'Logout', path: '#', onClick: handleLogout, isButton: true },
  ];

  if (role === 'admin') {
    navItems.unshift({ label: 'Admin Panel', path: '/admin' });
  }

  return (


    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      <div ><Link className="brand" to={'/'}>{config.appTitle}</Link></div>
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
