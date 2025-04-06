"use client";

import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { useRouter } from 'next/navigation';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLoginRegister = () => {
    if (username && password) {
      if (isLogin) {
        console.log('Logging in with:', username, password);
        if (username === 'user' && password === 'pass') {
          router.push('/ecommerce');
        } else {
          alert('Incorrect username or password');
        }
      } else {
        console.log('Registering with:', username, password);
        alert('Registration successful. Please login.');
        setIsLogin(true);
      }
    } else {
      alert('Please enter username and password');
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Spline scene="https://prod.spline.design/0wmGteug47UXdBQm/scene.splinecode" />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 text-black z-[99] rounded-lg border-2 border-black">
        {/* Tabs */}
        <div className="flex border-b-2 border-black">
          <button
            className={`flex-1 px-4 py-2 rounded-tl-lg ${isLogin ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-tr-lg ${!isLogin ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 focus:bg-transparent border border-black border-opacity-50"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 focus:bg-transparent border border-black border-opacity-50"
            />
          </div>
          <button
            onClick={handleLoginRegister}
            className="w-full p-2 bg-black bg-opacity-80 rounded-md hover:bg-gray-800 text-white"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}