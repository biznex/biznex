"use client";

import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

function JobDashboardHeader() {
  const [showOptions, setShowOptions] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setCurrentDateTime(new Date());
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDateTime = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('jtoken');
    router.push("/login");
  };

  // --- THIS IS THE FIX ---
  // Added a leading slash "/" to make the path absolute
  const handleEditProfile = () => {
    router.push("/jobdashboard/profile");
  };

  const handleViewApplications = () => {
    router.push("/jobdashboard/applied");
  };

  return (
    <header className="w-full p-4 border-b border-gray-400 flex justify-between items-center text-[#2F2F2F] relative bg-white">
      {/* Left side: Date Time */}
      <div className="flex items-center">
        <span className="mr-4">{formatDateTime(currentDateTime)}</span>
      </div>

      {/* Right side: User Info */}
      <div className="flex items-center relative">
        <h1 className="mr-4">Hey, Alex!</h1>

        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-4"
          onClick={handleViewApplications}
        >
          View Applications
        </button>

        <div className="relative">
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md border border-gray-300 flex flex-col w-36 z-50">
              <button
                className="px-4 py-2 hover:bg-gray-100 text-left"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
              <button
                className="px-4 py-2 hover:bg-gray-100 text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default JobDashboardHeader;