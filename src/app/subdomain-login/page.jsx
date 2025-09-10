"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function App() {
  // General State
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');

  // Registration Flow State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);

  const domainName = typeof window !== "undefined" ? window.location.hostname : "";
  
  // ADDED: useEffect to help debug the verification flow state
  useEffect(() => {
    console.log("Verification State Changed:", { isEmailVerified, isOtpVerified, isPhoneVerified, isPhoneOtpVerified });
  }, [isEmailVerified, isOtpVerified, isPhoneVerified, isPhoneOtpVerified]);


  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setPhone('');
    setPhoneOtp('');
    setError('');
    setIsEmailVerified(false);
    setIsOtpVerified(false);
    setIsPhoneVerified(false);
    setIsPhoneOtpVerified(false);
  };

  const handleToggleMode = (mode) => {
    resetForm();
    setIsLogin(mode);
  };
  
  const handleVerifyEmail = async () => {
    if (!email || !name) {
      setError("Please enter your name and email address.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const API_URL_VERIFY_EMAIL = `https://biznex.onrender.com/signsub/send-email-otp?subdomain=${domainName}`;
      const response = await axios.post(API_URL_VERIFY_EMAIL, { email });
      
      const data= await response.data;
      console.log("Email OTP Response:", data);

      if (response.data.message == "Email OTP sent successfully.") {
        alert("Verification code sent to your email.");
        setIsEmailVerified(true);
      } else {
        setError(response.data.message || "Failed to send verification code.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const API_URL_VERIFY_OTP = `https://biznex.onrender.com/signsub/verify-email-otp?subdomain=${domainName}`;
      // --- THIS IS THE FIX ---
      // The payload key must be 'emailOtp' but the value comes from the 'otp' state.
      const response = await axios.post(API_URL_VERIFY_OTP, { email, emailOtp: otp });

      const data = await response.data;
      console.log("OTP Verification Response:", data);

      if (response.data.message == "Email verified successfully.") {
        alert("Email OTP verified successfully!");
        setIsOtpVerified(true);
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during OTP verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phone) {
        setError("Please enter your phone number.");
        return;
    }
    setIsLoading(true);
    setError('');
    try {
        const API_URL_VERIFY_PHONE = `https://biznex.onrender.com/signsub/send-phone-otp?subdomain=${domainName}`;
        const response = await axios.post(API_URL_VERIFY_PHONE, { email, phone });

        const data = await response.data;
        console.log("Phone OTP Response:", data);

        if (response.data.message == "Phone OTP sent successfully.") {
            alert("Verification code sent to your phone.");
            setIsPhoneVerified(true);
        } else {
            setError(response.data.message || "Failed to send verification code.");
        }
    } catch (err) {
        setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) {
        setError("Please enter the phone OTP.");
        return;
    }
    setIsLoading(true);
    setError('');
    try {
        const API_URL_VERIFY_PHONE_OTP = `https://biznex.onrender.com/signsub/verify-phone-otp?subdomain=${domainName}`;
        const response = await axios.post(API_URL_VERIFY_PHONE_OTP, { email , phoneOtp });

        const data = await response.data;
        console.log("Phone OTP Verification Response:", data);

        if (response.data.message == "Phone verified successfully.") {
            alert("Phone number verified successfully!");
            setIsPhoneOtpVerified(true);
        } else {
            setError(response.data.message || "Invalid OTP. Please try again.");
        }
    } catch (err) {
        setError(err.response?.data?.message || "An error occurred during phone OTP verification.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleLogin = async () => {
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    setIsLoading(true);
    setError('');
    try {
        const API_URL_LOGIN = `https://biznex.onrender.com/signsub/login?subdomain=${domainName}`;
        const response = await axios.post(API_URL_LOGIN, { email, password });
        
        if (response.data.token) {
            localStorage.setItem('utoken', response.data.token);
            alert('Login successful');
            router.push('../subdomain');
        } else {
            setError(response.data.message || "Login failed.");
        }
    } catch (err) {
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (!password) {
        setError("Please enter a password.");
        return;
    }
    setIsLoading(true);
    setError('');
    try {
        const API_URL_REGISTER = `https://biznex.onrender.com/signsub/create-user?subdomain=${domainName}`;
        
        // --- THIS IS THE FIX ---
        // Ensured the 'name' field is correctly sent in the payload
        const response = await axios.post(API_URL_REGISTER, { username: name, email, phone, password });

        const data = await response.data;
        console.log("Registration Response:", data);
        
        if (response.data.message == "Signup successful.") {
            alert("Registration successful! Please log in.");
            handleToggleMode(true);
        } else {
            setError(response.data.message || "Registration failed.");
        }
    } catch (err) {
        setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="w-96 text-black rounded-lg border-2 border-black p-0">
        <div className="flex border-b-2 border-black">
          <button
            className={`flex-1 px-4 py-2 rounded-tl-lg ${isLogin ? 'border-b-2 border-[#5A43E0]' : ''}`}
            onClick={() => handleToggleMode(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-tr-lg ${!isLogin ? 'border-b-2 border-[#5A43E0]' : ''}`}
            onClick={() => handleToggleMode(false)}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          {isLogin ? (
            // LOGIN FORM
            <div>
              <div className="mb-4">
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 focus:bg-transparent border border-black border-opacity-50" />
              </div>
              <div className="mb-4">
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 focus:bg-transparent border border-black border-opacity-50" />
              </div>
              <button onClick={handleLogin} disabled={isLoading} className="w-full p-2 rounded-md bg-[#5A43E0] hover:bg-[#482FC1] text-white disabled:bg-gray-400">
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          ) : (
            // REGISTER FORM
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" placeholder="Your Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isEmailVerified} className="w-full p-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 border border-black border-opacity-50 disabled:bg-gray-100" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEmailVerified} className="w-full p-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 border border-black border-opacity-50 disabled:bg-gray-100" />
                  {!isEmailVerified && (
                    <button onClick={handleVerifyEmail} disabled={isLoading || !name} className="p-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm disabled:bg-gray-400">
                      {isLoading ? '...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              {isEmailVerified && !isOtpVerified && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Enter Email OTP</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="6-Digit Code" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 border border-black border-opacity-50" />
                    <button onClick={handleVerifyOtp} disabled={isLoading} className="p-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm disabled:bg-gray-400">
                      {isLoading ? '...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}
              
              {isOtpVerified && !isPhoneVerified && (
                  <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <div className="flex gap-2">
                          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 border border-black border-opacity-50" />
                          <button onClick={handleVerifyPhone} disabled={isLoading} className="p-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm disabled:bg-gray-400">
                              {isLoading ? '...' : 'Verify'}
                          </button>
                      </div>
                  </div>
              )}
              
              {isPhoneVerified && !isPhoneOtpVerified && (
                  <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Enter Phone OTP</label>
                      <div className="flex gap-2">
                          <input type="text" placeholder="6-Digit Code" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} className="w-full p-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 border border-black border-opacity-50" />
                          <button onClick={handleVerifyPhoneOtp} disabled={isLoading} className="p-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm disabled:bg-gray-400">
                              {isLoading ? '...' : 'Verify'}
                          </button>
                      </div>
                  </div>
              )}
              
              {isPhoneOtpVerified && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 border border-black border-opacity-50" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 rounded-md bg-transparent text-black placeholder-black placeholder-opacity-20 border border-black border-opacity-50" />
                  </div>
                  <button onClick={handleRegister} disabled={isLoading || !password || password !== confirmPassword} className="w-full p-2 rounded-md bg-[#5A43E0] hover:bg-[#482FC1] text-white disabled:bg-gray-400">
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}