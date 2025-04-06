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

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 gap-4 p-8 rounded-lg bg-transparent w-96 text-black border border-black z-[99]">
        <div className="col-span-2">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {isLogin ? 'Login' : 'Register'}
          </h2>
        </div>

        <div className="col-span-2">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 focus:bg-transparent border border-black border-opacity-50"
          />
        </div>

        <div className="col-span-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 focus:bg-transparent border border-black border-opacity-50"
          />
        </div>

        <div className="col-span-2">
          <button
            onClick={handleLoginRegister}
            className="w-full p-2 bg-black-500 bg-opacity-80 rounded-md hover:bg-black-600 text-black"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>

        <div className="col-span-2 text-center mt-2">
          {isLogin ? (
            <span
              className="text-black-300 cursor-pointer"
              onClick={() => setIsLogin(false)}
            >
              Register here
            </span>
          ) : (
            <span
              className="text-black-300 cursor-pointer"
              onClick={() => setIsLogin(true)}
            >
              Login here
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
