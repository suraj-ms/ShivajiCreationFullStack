import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import './SignUp.css'; // Import the CSS file for SignUp
import { Link } from 'react-router-dom';


function SignUp() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // React Router hook to navigate

  const handleSignUp = async (e) => {
    console.log("in handleSignUp method");

    e.preventDefault();

    // Check if the passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const userData = { userName, email, password };

    try {
      const response = await fetch(`https://shivajicreationfullstack.onrender.com/api/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // If sign-up is successful (status code 200)
      if (data.success) {
        console.log("User registered successfully");

        // Optionally store token or user data for the session
        localStorage.setItem('token', data.token); // Save the token in local storage

        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        // If sign-up fails, show the error message
        setError(data.message || 'Sign-up failed. Please try again.');
      }
    } catch (error) {
      console.log(error);

      // Handle network or server errors
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}  {/* Show error message if any */}
        <button type="submit">Sign Up</button>
        <p>Already have account Please <Link to='/login'>Login</Link> </p>
      </form>
    </div>
  );
}

export default SignUp;
