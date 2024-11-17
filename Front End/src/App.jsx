import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'; // Import Navbar component

function App() {

  const location = useLocation(); // Hook to get the current route


  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/signup'  && <Navbar />}
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App
