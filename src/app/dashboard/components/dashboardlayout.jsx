"use client";

import React, { useState } from 'react';
import DashboardHeader from './dashboardheader';
import DashboardSidebar from './dashboardsidebar';
import { AiOutlineMenu } from 'react-icons/ai';

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-[#FEFEFF] text-black border-gray-400">
      {/* Hamburger Menu (Mobile View) */}
      <button
        className={`absolute top-4 left-4 md:hidden z-50 ${isSidebarOpen ? 'text-white' : 'text-black'}`}
        onClick={toggleSidebar}
      >
        <AiOutlineMenu size={24} />
      </button>

      {/* Floating Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-48 flex flex-col text-left transition-transform duration-300 transform z-40 ${
          isSidebarOpen
            ? 'translate-x-0 backdrop-filter backdrop-blur-lg bg-opacity-20 bg-black text-white' // Added text-white here
            : '-translate-x-full'
        } md:static md:translate-x-0 md:border-r md:border-[#98A1AE] md:bg-opacity-0`}
      >
        <DashboardSidebar />
      </div>

      {/* Main Content (Header and Content) */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="bg-opacity-0">
          <DashboardHeader />
        </div>
        <main className="flex-1 p-4 bg-opacity-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;