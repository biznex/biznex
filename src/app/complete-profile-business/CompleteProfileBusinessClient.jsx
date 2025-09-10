"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function CompleteProfile({ userType, authMethod }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const password = searchParams.get('password');
  const phone = searchParams.get('phone');
  const [businessName, setBusinessName] = useState("");
  const[ownerName, setOwnerName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    setError(null);
    setSuccess(null);

    const category = businessCategory === "Other" ? customCategory : businessCategory;
    const payload = {
      username : businessName,
      ownername : ownerName,
      address : businessAddress, 
      email : email,
      business_category : category,
      phone : phone, 
      password : password 
    };

    try {
      const response = await fetch("https://biznex.onrender.com/signup/client/create-client", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      console.log("Props received:", { email, phone, password });
      console.log("Payload sent:", payload);
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to complete profile");
      }
      
      setSuccess("Profile completed successfully!");
      alert("Profile completed successfully!\nYou can now log in.");
      router.push("../login"); // Redirect to login page after successful profile completion
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-transparent">
      {/* Bento Box Container with Fixed Width */}
      <div className="relative w-96 md:w-[450px] lg:w-[500px] p-4">
        
        {/* Heading */}
        <h1 className="text-2xl font-bold text-black text-center mb-4">Complete Business Profile</h1>

        {/* Form Container with White Border */}
        <div className="p-3 border border-black rounded-lg">
          <form className="space-y-2">
            {/* Owner Name */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-black bg-transparent text-black placeholder-black rounded-md focus:outline-none"
              placeholder="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              
            />

            {/* Business Name */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-black bg-transparent text-black placeholder-black rounded-md focus:outline-none"
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              
            />

{/* Business Category Dropdown with Custom Arrow */}
<div className="relative">
  <select
    className="w-full px-3 py-2 border border-black bg-transparent text-black rounded-md focus:outline-none appearance-none pr-10"
    value={businessCategory}
    onChange={(e) => setBusinessCategory(e.target.value)}
  >
    <option value="" disabled hidden>
      Select Business Category
    </option>
    <option value="Retail & Ecommerce" className="bg-black text-black">
      Retail & Ecommerce
    </option>
    <option value="Education" className="bg-black text-black">Education</option>
    <option value="Consultation" className="bg-black text-black">
      Consultation
    </option>
    <option value="Services" className="bg-black text-black">Services</option>
    <option value="Food" className="bg-black text-black">Food</option>
    <option value="Other" className="bg-black text-black">Other</option>
  </select>

  {/* Custom Arrow */}
  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-black"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>





            {/* Custom Business Category (only if 'Other' is selected) */}
            {businessCategory === "Other" && (
              <input
                type="text"
                className="w-full px-3 py-2 border border-black bg-transparent text-black placeholder-black rounded-md focus:outline-none"
                placeholder="Enter Business Category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}

            {/* Business Address */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-black bg-transparent text-black placeholder-black rounded-md focus:outline-none"
              placeholder="Business Address"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />

            {/* Phone Number & OTP (if Google authentication is used) */}
            {/*{authMethod === "google" && (
              <>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-black bg-transparent text-black placeholder-white rounded-md focus:outline-none"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-black"
                  >
                    Send OTP
                  </button>
                </div>

                {otpSent && (
                  <>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-black bg-transparent text-black placeholder-white rounded-md focus:outline-none"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="mt-2 text-black"
                    >
                      Verify OTP
                    </button>
                  </>
                )}
              </>
            )}*/}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            {/* Orange Submit Button */}
            <button
              type="submit"
              className="w-full text-white py-2 mt-3 bg-[#5D46E7] rounded-lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              
              {loading ? "Submitting..." : "Complete Business Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
