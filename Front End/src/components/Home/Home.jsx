import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Used for redirection

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated by checking the token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // If no token found, redirect to the login page
      navigate('/login');
    }
  }, [navigate]); // Dependency array ensures the effect runs once on component mount

  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <p>You are logged in and can access this page.</p>
    </div>
  );
}

export default Home;
