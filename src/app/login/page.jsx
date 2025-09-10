"use client";

import { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react"; 
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);
  const [showBusinessLogin, setShowBusinessLogin] = useState(false);
  const [showBusinessRegister, setShowBusinessRegister] = useState(false);
  const [showBEmailOtpField, setShowBEmailOtpField] = useState(false);
  const [showBNumberOtpField, setShowBNumberOtpField] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [numberVerified, setNumberVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isPhoneOtpVerified, setIsPhoneOtpVerified] = useState(false);

  const [showAspirantLogin, setShowAspirantLogin] = useState(false);
  const [showAspirantRegister, setShowAspirantRegister] = useState(false);
  const [showJANumberOtpField, setShowJANumberOtpField] = useState(false);
  const [jobAspirantEmail, setJobAspirantEmail] = useState("");
  const [jobAspirantEmailOtp, setJobAspirantEmailOtp] = useState("");
  const [isJAEmailOtpVerified, setIsJAEmailOtpVerified] = useState(false);
  const [jobAspirantPhone, setJobAspirantPhone] = useState("");
  const [jobAspirantPhoneOtp, setJobAspirantPhoneOtp] = useState("");
  const [isJAPhoneOtpVerified, setIsJAPhoneOtpVerified] = useState(false);
  const [isJAPhoneVerified, setIsJAPhoneVerified] = useState(false);
  const [showJobAspirantEmailOtpField, setShowJobAspirantEmailOtpField] = useState(false);
  const [isJAEmailVerified, setIsJAEmailVerified ] = useState(false);
  const [jobAspirantPassword, setJobAspirantPassword] = useState("");
  const [showJAPassword, setShowJAPassword] = useState(false);
  const [showJAConfirmPassword, setShowJAConfirmPassword] = useState(false);
  const [jobAspirantConfirmPassword, setJobAspirantConfirmPassword] = useState("");
  const [jobAspirantLoading, setJobAspirantLoading] = useState(false);
  const [jobAspirantError, setJobAspirantError] = useState("");
  const [aspirantLoading, setAspirantLoading] = useState(false);
  const [aspirantError, setAspirantError] = useState("");

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const jtoken = typeof window !== 'undefined' ? localStorage.getItem('jtoken') : null;

  const data = {
    email,
    phone,
    password,
  };

  const handleRegister = async () => {
    if (!isEmailOtpVerified || !isPhoneOtpVerified) {
      setError("Please verify your email and phone first.");
      return;
    }
  
    if (password.length < 8) {
      setError("Password should be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setShowModal(true);
    const queryParams = new URLSearchParams({ email, password, phone }).toString();
    router.push(`../complete-profile-business?${queryParams}`);
  };
 
  const handleJARegister = async () => {
    if (!isJAEmailOtpVerified || !isJAPhoneOtpVerified) {
      setError("Please verify your email and phone first.");
      return;
    }
  
    if (jobAspirantPassword.length < 8) {
      setError("Password should be at least 8 characters");
      return;
    }
    if (jobAspirantPassword !== jobAspirantConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setShowModal(true);
    const queryParams = new URLSearchParams({ jobAspirantEmail, jobAspirantPassword, jobAspirantPhone }).toString();
    router.push(`../complete-profile-job?${queryParams}`);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch('https://biznex.onrender.com/login/client/login-client', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Login Successful!");
        localStorage.setItem('token', data.token);
        router.push("../dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push("../dashboard");
    }
  }, []);

  const handleGoogleAuthRedirect = () => {
    window.location.href = 'https://biznex.onrender.com/auth/google/client';
  };

  const handleJobAspirantLogin = async () => {
    setJobAspirantLoading(true);
    setJobAspirantError("");
  
    try {
      const response = await fetch('https://biznex.onrender.com/login/job-user/login-job-user', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: jobAspirantEmail,
          password: jobAspirantPassword,
        }),
      });
  
      


      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Login Successful!");
        localStorage.setItem('jtoken', data.token);
        router.push("../jobdashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      setJobAspirantError("An unexpected error occurred. Please try again later.");
    } finally {
      setJobAspirantLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://biznex.onrender.com/signup/client/send-email-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        setIsEmailVerified(true);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyJAEmail = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://biznex.onrender.com/signup/job-user/send-email-otp-job-user", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: jobAspirantEmail }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        setIsJAEmailVerified(true);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyEmailOtp = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://biznex.onrender.com/signup/client/verify-email-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, emailOtp }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setIsEmailOtpVerified(true);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyJAEmailOtp = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://biznex.onrender.com/signup/job-user/verify-email-otp-job-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: jobAspirantEmail, emailOtp: jobAspirantEmailOtp }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setIsJAEmailOtpVerified(true);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending email OTP:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://biznex.onrender.com/signup/client/send-phone-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data.message === 'Phone OTP sent successfully.') {
        setIsPhoneVerified(true);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyJAPhone = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://biznex.onrender.com/signup/job-user/send-phone-otp-job-user', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: jobAspirantEmail, phone: jobAspirantPhone }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data.message === 'Phone OTP sent successfully.') {
        setIsJAPhoneVerified(true);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://biznex.onrender.com/signup/client/verify-phone-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phoneOtp }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data.message === 'Phone verified successfully.') {
        setIsPhoneOtpVerified(true);
      } else {
        setError(data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyJAPhoneOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://biznex.onrender.com/signup/job-user/verify-phone-otp-job-user', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: jobAspirantEmail, phoneOtp: jobAspirantPhoneOtp }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok && data.message === 'Phone verified successfully.') {
        setIsJAPhoneOtpVerified(true);
      } else {
        setError(data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAspirantLogin = async () => {
    setAspirantLoading(true);
    setAspirantError("");

    try {
      const response = await fetch('https://yourapi.com/login/aspirant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: jobAspirantEmail,
          password: jobAspirantPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        window.location.href = '/aspirant-dashboard';
      } else {
        setAspirantError(data.message || "Login failed");
      }
    } catch (error) {
      setAspirantError("An unexpected error occurred. Please try again later.");
    } finally {
      setAspirantLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowBusinessLogin(false);
        setShowAspirantLogin(false);
        setShowBusinessRegister(false);
        setShowAspirantRegister(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showBusinessLogin, showAspirantLogin, showBusinessRegister, showAspirantRegister]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Business Section */}
        <div className="p-6 sm:p-8 shadow-md rounded-lg text-center border border-gray-300">
          <h2 className="text-3xl font-bold text-black">For Businesses</h2>
          <p className="text-black mt-2">Curated for businesses to find top talent and grow.</p>
          <button
            className="mt-6 w-full px-6 py-3 bg-[#5D46E7] text-white rounded-md hover:bg-[#4A38B8] transition"
            onClick={() => setShowBusinessLogin(true)}
          >
            Login
          </button>
          <p className="mt-4 text-black">Don't have an account?</p>
          <button
            className="mt-2 w-full px-6 py-3 border border-[#5D46E7] text-[#5D46E7] rounded-md hover:bg-purple-100 transition"
            onClick={() => setShowBusinessRegister(true)}
          >
            Register as Business
          </button>
        </div>

        {/* Job Aspirants Section */}
        <div className="p-6 sm:p-8 shadow-md rounded-lg text-center border border-gray-300">
          <h2 className="text-3xl font-bold text-black">For Job Aspirants</h2>
          <p className="text-black mt-2">Curated for job seekers to find new opportunities.</p>
          <button
            className="mt-6 w-full px-6 py-3 bg-[#5D46E7] text-white rounded-md hover:bg-[#4A38B8] transition"
            onClick={() => setShowAspirantLogin(true)}
          >
            Login
          </button>
          <p className="mt-4 text-black">Don't have an account?</p>
          <button
            className="mt-2 w-full px-6 py-3 border border-[#5D46E7] text-[#5D46E7] rounded-md hover:bg-purple-100 transition"
            onClick={() => setShowAspirantRegister(true)}
          >
            Sign up as Job Aspirant
          </button>
        </div>
      </div>

      {/* Business Login Popup */}
      {showBusinessLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 rounded-lg border border-gray-300 bg-opacity-80 bg-white backdrop-blur-md">
            <div className="absolute top-3 left-3 text-black cursor-pointer hover:text-gray-600">
              <ArrowLeft size={20} onClick={() => setShowBusinessLogin(false)} />
            </div>
            <div className="absolute top-3 right-3 text-black cursor-pointer hover:text-gray-600">
              <X size={20} onClick={() => setShowBusinessLogin(false)} />
            </div>

            <h2 className="text-xl font-semibold text-black text-center">Business Login</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mt-4 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              className={`w-full mt-4 px-4 py-2 ${loading ? 'bg-gray-500' : 'bg-[#5D46E7]'} text-white text-sm rounded-md hover:bg-[#4A38B8] transition`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <button 
              className="w-full mt-2 px-4 py-2 border border-gray-300 text-black text-sm rounded-md hover:bg-gray-100 transition"
              onClick={handleGoogleAuthRedirect}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      )}

      {/* Job Aspirant Login Popup */}
      {showAspirantLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 rounded-lg border border-gray-300 bg-opacity-80 bg-white backdrop-blur-md">
            <div className="absolute top-3 left-3 text-black cursor-pointer hover:text-gray-600">
              <ArrowLeft size={20} onClick={() => setShowAspirantLogin(false)} />
            </div>
            <div className="absolute top-3 right-3 text-black cursor-pointer hover:text-gray-600">
              <X size={20} onClick={() => setShowAspirantLogin(false)} />
            </div>

            <h2 className="text-xl font-semibold text-black text-center">Job Aspirant Login</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mt-4 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
              onChange={(e) => setJobAspirantEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
              onChange={(e) => setJobAspirantPassword(e.target.value)}
            />
            <button 
              className={`w-full mt-4 px-4 py-2 ${jobAspirantLoading ? 'bg-gray-500' : 'bg-[#5D46E7]'} text-white text-sm rounded-md hover:bg-[#4A38B8] transition`}
              onClick={handleJobAspirantLogin}
              disabled={jobAspirantLoading}
            >
              {jobAspirantLoading ? 'Logging in...' : 'Login'}
            </button>
            {jobAspirantError && <p className="text-red-500 text-xs mt-1">{jobAspirantError}</p>}
            <button 
              className="w-full mt-2 px-4 py-2 border border-gray-300 text-black text-sm rounded-md hover:bg-gray-100 transition"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      )}

      {/* Business Registration Popup */}
      {showBusinessRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 rounded-lg border border-gray-300 bg-opacity-80 bg-white backdrop-blur-md">
            <div className="absolute top-3 left-3 text-black cursor-pointer hover:text-gray-600">
              <ArrowLeft size={20} onClick={() => setShowBusinessRegister(false)} />
            </div>
            <div className="absolute top-3 right-3 text-black cursor-pointer hover:text-gray-600">
              <X size={20} onClick={() => setShowBusinessRegister(false)} />
            </div>

            <h2 className="text-xl font-semibold text-black text-center">Business Registration</h2>

            <div className="relative w-full mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                className="w-full p-2 pr-20 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                disabled={isEmailVerified}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5D46E7] text-sm cursor-pointer px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowBEmailOtpField(true);
                  handleVerifyEmail();
                }}
                disabled={isEmailVerified}
              >
                {isEmailVerified ? "✔ Verified" : "Verify Email"}
              </button>
            </div>

            {showBEmailOtpField && isEmailVerified && (
              <div className="relative w-full mt-2">
                <input
                  type="text"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-2 pr-20 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                />
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5D46E7] text-sm cursor-pointer"
                  onClick={() => {
                    setIsEmailVerified(true);
                    setShowBEmailOtpField(false);
                    handleVerifyEmailOtp();
                  }}
                >
                  Verify OTP
                </button>
              </div>
            )}

            <div className="relative w-full mt-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your Phone Number"
                className="w-full py-2 px-3 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400 focus:outline-none"
                disabled={isPhoneVerified}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent text-[#5D46E7] text-sm cursor-pointer px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowBNumberOtpField(true);
                  handleVerifyPhone();
                }}
                disabled={isPhoneVerified || loading}
              >
                {isPhoneVerified ? "✔ Verified" : "Verify PhNo"}
              </button>
            </div>

            {showBNumberOtpField && isPhoneVerified && (
              <div className="relative w-full mt-2 flex items-center">
                <input
                  type="text"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  placeholder="Enter OTP"
                  disabled={isPhoneOtpVerified}
                  className="w-full p-2 pr-20 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                />
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5D46E7] text-sm cursor-pointer px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleVerifyPhoneOtp}
                  disabled={isPhoneOtpVerified || loading}
                >
                  {isPhoneOtpVerified ? "✔ Verified" : "Verify OTP"}
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-2 mt-2">
              <div className="relative w-full md:w-1/2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <div className="relative w-full md:w-1/2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <button
              className="w-full mt-4 px-4 py-2 bg-[#5D46E7] text-white text-sm rounded-md hover:bg-[#4A38B8] transition"
              onClick={handleRegister}
            >
              Complete Business Profile
            </button>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 rounded-lg border border-gray-300 bg-opacity-80 bg-white backdrop-blur-md">
                  <p>Content of complete-business-profile goes here</p>
                  <button 
                    className="w-full mt-4 px-4 py-2 bg-[#5D46E7] text-white text-sm rounded-md hover:bg-[#4A38B8] transition"
                    onClick={() => {
                      setShowModal(false);
                      router.back();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Job Aspirant Registration Popup */}
      {showAspirantRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 rounded-lg border border-gray-300 bg-opacity-80 bg-white backdrop-blur-md">
            <div className="absolute top-3 left-3 text-black cursor-pointer hover:text-gray-600">
              <ArrowLeft size={20} onClick={() => setShowAspirantRegister(false)} />
            </div>
            <div className="absolute top-3 right-3 text-black cursor-pointer hover:text-gray-600">
              <X size={20} onClick={() => setShowAspirantRegister(false)} />
            </div>

            <h2 className="text-xl font-semibold text-black text-center">Job Aspirant Registration</h2>

            <div className="relative w-full mt-2">
              <input
                type="email"
                value={jobAspirantEmail}
                onChange={(e) => setJobAspirantEmail(e.target.value)}
                placeholder="Enter your Email"
                className="w-full p-2 pr-20 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                disabled={isJAEmailVerified}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5D46E7] text-sm cursor-pointer"
                onClick={() => {
                  setShowJobAspirantEmailOtpField(true);
                  handleVerifyJAEmail();
                }}
                disabled={isJAEmailVerified}
              >
                {isJAEmailVerified ? "✔ Verified" : "Verify Email"}
              </button>
            </div>

            {showJobAspirantEmailOtpField && isJAEmailVerified && (
              <div className="relative w-full mt-2">
                <input
                  type="text"
                  value={jobAspirantEmailOtp}
                  onChange={(e) => setJobAspirantEmailOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-2 pr-20 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5D46E7] text-sm cursor-pointer"
                  onClick={() => {
                    setIsJAEmailVerified(true);
                    setShowJobAspirantEmailOtpField(false);
                    handleVerifyJAEmailOtp();
                  }}
                >
                  Verify OTP
                </span>
              </div>
            )}

            <div className="relative w-full mt-2">
              <input
                type="tel"
                value={jobAspirantPhone}
                onChange={(e) => setJobAspirantPhone(e.target.value)}
                placeholder="Enter your Phone Number"
                className="w-full py-2 px-3 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400 focus:outline-none"
                disabled={isJAPhoneVerified}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5D46E7] text-sm cursor-pointer"
                onClick={() => {
                  setShowJANumberOtpField(true);
                  handleVerifyJAPhone();
                }}
                disabled={isJAPhoneVerified || loading}
              >
                {isJAPhoneVerified ? "✔ Verified" : "Verify PhNo"}
              </button>
            </div>

            {showJANumberOtpField && isJAPhoneVerified && (
              <div className="relative w-full mt-2 flex items-center">
                <input
                  type="text"
                  value={jobAspirantPhoneOtp}
                  onChange={(e) => setJobAspirantPhoneOtp(e.target.value)}
                  placeholder="Enter OTP"
                  disabled={isJAPhoneOtpVerified}
                  className="w-full p-2 pr-20 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5D46E7] text-sm cursor-pointer"
                  onClick={handleVerifyJAPhoneOtp}
                  disabled={isJAPhoneOtpVerified || loading}
                >
                  {isJAPhoneOtpVerified ? "✔ Verified" : "Verify OTP"}
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-2 mt-2">
              <div className="relative w-full md:w-1/2">
                <input
                  type={showJAPassword ? "text" : "password"}
                  placeholder="Create Password"
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                  value={jobAspirantPassword}
                  onChange={(e) => setJobAspirantPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  onClick={() => setShowJAPassword(!showJAPassword)}
                >
                  {showJAPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <div className="relative w-full md:w-1/2">
                <input
                  type={showJAConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent text-black text-sm placeholder-gray-400"
                  value={jobAspirantConfirmPassword}
                  onChange={(e) => setJobAspirantConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                  onClick={() => setShowJAConfirmPassword(!showJAConfirmPassword)}
                >
                  {showJAConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <button
              className="w-full mt-4 px-4 py-2 bg-[#5D46E7] text-white text-sm rounded-md hover:bg-[#4A38B8] transition"
              onClick={handleJARegister}
            >
              Complete Job Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}