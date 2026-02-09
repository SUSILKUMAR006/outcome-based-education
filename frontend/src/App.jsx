import React, { useEffect } from 'react'
import Navbar from './component/Navbar'
import Home from './component/Home'
import OverAllInfo from './component/OverAllInfo'

const App = () => {

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (token && loginTime) {
      const now = Date.now();
      const diff = now - Number(loginTime);

      const maxSessionTime = 3 * 60 * 60 * 1000; // 5 hours

      if (diff > maxSessionTime) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <div className='bg-blue-100 pb-10 px-3 lg:px-15 pt-2'>
      <Navbar />
      <Home />
      <OverAllInfo />
    </div>
  );
}

export default App;
