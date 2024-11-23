import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import { Link } from 'react-router-dom';

function Login() {
    
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const navigate = useNavigate(); // React Router hook to navigate

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const userData = { userName, password };
  
    // Start loading
    setIsLoading(true);
    setError('');  // Reset any previous error message
  
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      // If the response is JSON, parse it
      const data = await response.json();
  
      // Handle response
      if (response.ok && data.success) {
        // Successful login
        localStorage.setItem('token', data.token); // Save token to localStorage
        navigate('/'); // Redirect to home page
      } else {
        // Display error message
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Catch any errors (network issues, etc.)
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      // End loading
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* Show error message if any */}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
        
        <p>Don't have an account? Please <Link to='/signup'>Sign Up</Link></p>
      </form>
    </div>
  );
}

export default Login;
