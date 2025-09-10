"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
// Removed unused import: import loadConfig from "next/dist/server/config";

export default function JobAspirantProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('jobAspirantEmail');
  const password = searchParams.get('jobAspirantPassword');
  const phone = searchParams.get('jobAspirantPhone');
  
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to display errors to the user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    // Basic validation
    if (!fullName || !dob || !address || !city || !state) {
        setError("Please fill out all fields.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('https://biznex.onrender.com/signup/job-user/create-job-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username:fullName,
          email:email,
          address:address,
          city:city,
          dob:dob,
          phone:phone,
          password:password
        }),
      });
      console.log(response)
      if (response.ok) {
        router.push('/login'); // Redirect to login page on success
      } else {
        // Handle API errors
        const errorData = await response.json();
        setError(errorData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError("A network error occurred. Please check your connection.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-transparent">
      {/* Bento Box Container */}
      <div className="relative w-96 md:w-[450px] lg:w-[500px] p-4">
        
        {/* Heading */}
        <h1 className="text-2xl font-bold text-white text-center mb-4">Complete Job Aspirant Profile</h1>

        {/* Form Container */}
        <div className="p-3 border border-white rounded-lg">
          {/* Use onSubmit on the form for proper submission handling */}
          <form className="space-y-2" onSubmit={handleSubmit}>
            {/* Full Name */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {/* Date of Birth */}
            <input
              type="date"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />

            {/* Address */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* City */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            {/* State */}
            <input
              type="text"
              className="w-full px-3 py-2 border border-white bg-transparent text-white placeholder-gray-300 rounded-md focus:outline-none"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            
            {/* Display error message if it exists */}
            {error && <p className="text-red-400 text-sm text-center pt-1">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white py-2 mt-3 bg-[#F06516] rounded-lg disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Complete Job Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}