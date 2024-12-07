import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';
import Home from './components/Home/Home.jsx';
import Measurement from './components/Measurement/Measurement.jsx';
import AdminPanel from './components/AdminPanel/AdminPanel.jsx';
import Bill from './components/Bill/Bill.jsx';
import PrivateRoute from './Pages/PrivateRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />}>
      <Route path="/" element={<PrivateRoute element={<Home />} />} />
      <Route path="/measurement/:orderNumber" element={<PrivateRoute element={<Measurement />} />} />
      <Route path="/bill/:orderNumber" element={<PrivateRoute element={<Bill  />} />} />
      <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Route>
  </Routes>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>
);
