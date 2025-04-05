"use client";
import { useState } from "react";

export default function JobAspirantProfile() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-transparent">
      {/* Bento Box Container with Fixed Width */}
      <div className="relative w-96 md:w-[450px] lg:w-[500px] p-4">
        
        {/* Heading */}
        <h1 className="text-2xl font-bold text-white text-center mb-4">Complete Job Aspirant Profile</h1>

        {/* Form Container with White Border */}
        <div className="p-3 border border-white rounded-lg">
          <form className="space-y-2">
            {/* Full Name */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-white rounded-md focus:outline-none"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {/* Date of Birth */}
            <input
              type="date"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-white rounded-md focus:outline-none"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />

            {/* Address */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-white rounded-md focus:outline-none"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Orange Submit Button */}
            <button
              type="submit"
              className="w-full text-white py-2 mt-3 bg-[#F06516] rounded-lg"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}