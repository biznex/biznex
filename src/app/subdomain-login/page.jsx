"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function SubdomainLoginPage() {
  const router = useRouter();

  // General state
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');

  // Verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);

  const domainName = typeof window !== "undefined" ? window.location.hostname : "";

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('utoken');
    if (token) {
      router.replace('/subdomain'); // main dashboard
    }
  }, [router]);

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

  // ====== API HANDLERS ======
  const handleVerifyEmail = async () => {
    if (!email || !name) return setError("Enter name and email.");
    setIsLoading(true); setError('');

    try {
      const res = await axios.post(
        `https://biznex.onrender.com/signsub/send-email-otp?subdomain=${domainName}`,
        { email }
      );
      if (res.data.message === "Email OTP sent successfully.") {
        alert("Email OTP sent!");
        setIsEmailVerified(true);
      } else setError(res.data.message || "Failed to send OTP.");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP.");
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("Enter OTP.");
    setIsLoading(true); setError('');

    try {
      const res = await axios.post(
        `https://biznex.onrender.com/signsub/verify-email-otp?subdomain=${domainName}`,
        { email, emailOtp: otp }
      );
      if (res.data.message === "Email verified successfully.") {
        alert("Email verified!");
        setIsOtpVerified(true);
      } else setError(res.data.message || "Invalid OTP.");
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying OTP.");
    } finally { setIsLoading(false); }
  };

  const handleVerifyPhone = async () => {
    if (!phone) return setError("Enter phone.");
    setIsLoading(true); setError('');

    try {
      const res = await axios.post(
        `https://biznex.onrender.com/signsub/send-phone-otp?subdomain=${domainName}`,
        { email, phone }
      );
      if (res.data.message === "Phone OTP sent successfully.") {
        alert("Phone OTP sent!");
        setIsPhoneVerified(true);
      } else setError(res.data.message || "Failed to send phone OTP.");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending phone OTP.");
    } finally { setIsLoading(false); }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) return setError("Enter phone OTP.");
    setIsLoading(true); setError('');

    try {
      const res = await axios.post(
        `https://biznex.onrender.com/signsub/verify-phone-otp?subdomain=${domainName}`,
        { email, phoneOtp }
      );
      if (res.data.message === "Phone verified successfully.") {
        alert("Phone verified!");
        setIsPhoneOtpVerified(true);
      } else setError(res.data.message || "Invalid phone OTP.");
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying phone OTP.");
    } finally { setIsLoading(false); }
  };

  const handleLogin = async () => {
    if (!email || !password) return setError("Enter email and password.");
    setIsLoading(true); setError('');

    try {
      const res = await axios.post(
        `https://biznex.onrender.com/signsub/login?subdomain=${domainName}`,
        { email, password }
      );
      if (res.data.token) {
        localStorage.setItem('utoken', res.data.token);
        alert("Login successful!");
        router.push('/subdomain');
      } else setError(res.data.message || "Login failed.");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally { setIsLoading(false); }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!password) return setError("Enter password.");
    setIsLoading(true); setError('');

    try {
      const res = await axios.post(
        `https://biznex.onrender.com/signsub/create-user?subdomain=${domainName}`,
        { username: name, email, phone, password }
      );
      if (res.data.message === "Signup successful.") {
        alert("Registration successful! Please log in.");
        handleToggleMode(true);
      } else setError(res.data.message || "Registration failed.");
    } catch (err) {
      setError(err.response?.data?.message || "Error registering user.");
    } finally { setIsLoading(false); }
  };

  // ====== RENDER ======
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="w-96 text-black rounded-lg border-2 border-black p-0">
        {/* Mode toggle */}
        <div className="flex border-b-2 border-black">
          <button className={`flex-1 px-4 py-2 rounded-tl-lg ${isLogin ? 'border-b-2 border-[#5A43E0]' : ''}`} onClick={() => handleToggleMode(true)}>Login</button>
          <button className={`flex-1 px-4 py-2 rounded-tr-lg ${!isLogin ? 'border-b-2 border-[#5A43E0]' : ''}`} onClick={() => handleToggleMode(false)}>Register</button>
        </div>

        <div className="p-8">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {isLogin ? (
            // LOGIN FORM
            <>
              <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
              <button onClick={handleLogin} disabled={isLoading} className="w-full p-2 rounded-md bg-[#5A43E0] text-white">
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </>
          ) : (
            // REGISTER FORM
            <>
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} disabled={isEmailVerified} className="w-full p-2 mb-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={isEmailVerified} className="flex-1 p-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
                {!isEmailVerified && <button onClick={handleVerifyEmail} disabled={isLoading || !name} className="p-2 rounded-md bg-gray-600 text-white">{isLoading ? "..." : "Verify"}</button>}
              </div>

              {isEmailVerified && !isOtpVerified && (
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Email OTP" value={otp} onChange={e => setOtp(e.target.value)} className="flex-1 p-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
                  <button onClick={handleVerifyOtp} disabled={isLoading} className="p-2 rounded-md bg-gray-600 text-white">{isLoading ? "..." : "Verify"}</button>
                </div>
              )}

              {isOtpVerified && !isPhoneVerified && (
                <div className="flex gap-2 mb-2">
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="flex-1 p-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
                  <button onClick={handleVerifyPhone} disabled={isLoading} className="p-2 rounded-md bg-gray-600 text-white">{isLoading ? "..." : "Verify"}</button>
                </div>
              )}

              {isPhoneVerified && !isPhoneOtpVerified && (
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Phone OTP" value={phoneOtp} onChange={e => setPhoneOtp(e.target.value)} className="flex-1 p-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
                  <button onClick={handleVerifyPhoneOtp} disabled={isLoading} className="p-2 rounded-md bg-gray-600 text-white">{isLoading ? "..." : "Verify"}</button>
                </div>
              )}

              {isPhoneOtpVerified && (
                <>
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
                  <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 mb-2 rounded-md border border-black placeholder-black placeholder-opacity-20" />
                  <button onClick={handleRegister} disabled={isLoading || !password || password !== confirmPassword} className="w-full p-2 rounded-md bg-[#5A43E0] text-white">{isLoading ? "Registering..." : "Register"}</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
