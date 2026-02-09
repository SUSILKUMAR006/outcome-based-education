import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [adminName, setAdminName] = useState(() => {
    return localStorage.getItem('user') || '';
  });

  useEffect(() => {
    const name = localStorage.getItem('user');
    if (name) setAdminName(name);
    
    // Poll localStorage for changes since storage events don't fire in same window
    const interval = setInterval(() => {
      const updatedName = localStorage.getItem('user');
      if (updatedName && updatedName !== adminName) {
        setAdminName(updatedName);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [adminName]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowModal(false);
    navigate('/login');
  };

  return (
    <div className="bg-white py-2 px-2 lg:px-5 flex justify-between shadow-lg rounded">
      {/* Left part */}
      <div className="flex gap-3 items-center">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img className="lg:w-13 lg:h-13 w-10 h-10" src={assets.logo} alt="logo" />
        </div>
        <div>
          <h1 className="font-bold lg:text-lg">OBE Tracking System</h1>
          <p className="text-[11px] lg:text-sm font-semibold text-gray-600">
            Outcome Based Education Assessment
          </p>
        </div>
      </div>

      {/* Right part */}
      <div className="flex justify-center items-center gap-2">
        <h1 className="rounded-full bg-green-500 w-8 h-8 lg:w-8 lg:h-8 flex justify-center items-center font-bold lg:text-xl text-white">
          {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
        </h1>
        <h2 className="hidden lg:block font-semibold">{adminName || 'Admin'}</h2>
        <h1 onClick={() => setShowModal(true)} className="text-2xl cursor-pointer">
          <i className="bx bx-log-out bx-rotate-180"></i>
        </h1>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg w-80 text-center">
            <h2 className="font-bold text-lg mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-around">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
