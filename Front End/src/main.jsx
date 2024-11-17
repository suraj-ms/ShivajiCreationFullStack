import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';
import Home from './components/Home/Home.jsx';
// import dotenv from 'dotenv';
// dotenv.config();


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // This is the root component
    children: [
      {
        path: "/",
        element: <Home /> // Make Home component the default page
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <Signup />
      },
    ],
  },
]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
