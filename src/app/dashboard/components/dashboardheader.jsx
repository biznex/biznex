import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

function DashboardHeader() {
  const [showOptions, setShowOptions] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setDateTime(new Date());
    const intervalId = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date) => {
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
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    router.push("/login");
  };

  const handleEditProfile = () => {
    router.push("/dashboard/profile");
  };

  return (
    <header className="p-4 border-b border-gray-400 flex justify-between items-center text-[#2F2F2F] relative">
      <div className="flex items-center">
        <span className="mr-4">{formatDate(dateTime)}</span>
      </div>

      <div className="flex items-center relative">
        <h1 className="mr-2">Hey, Alex!</h1>
        <div className="relative">
          <FaUserCircle
            className="text-2xl cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md border border-gray-300 flex flex-col w-36">
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

export default DashboardHeader;