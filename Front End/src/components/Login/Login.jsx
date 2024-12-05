import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Login.css';
import config from '../../utils/config';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await api.post('/login', { userName, password });
      localStorage.setItem('authToken', response.data.token);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='login_page'>
      <h1 className='app_title'>{config.appTitle}</h1>
      <div className="login-container">
        <p className='login_text'>Login</p>
        <ion-icon name="person-circle-outline"></ion-icon>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="error">{error}</div>}
          <button className='login_submit_btn' type="submit">Log in</button>
          {/* <h4>Forgot Password</h4> tbd */}
        </form>
      </div>
    </div>
  );
};

export default Login;
