"use client";

import React, { useState } from "react";
import DashboardLayout from '../../components/dashboardlayout';

const SubdomainAllocation = () => {
      const [subdomain, setSubdomain] = useState("");
      const [error, setError] = useState("");
  
      const handleInputChange = (e) => {
            const value = e.target.value;
    
            if (value.length > 10) {
                  setError("Subdomain can be max 10 characters.");
                  return;
            }
    
            const isValid = /^[a-zA-Z0-9-]*$/.test(value);
    
            if (!isValid) {
                  setError("Only letters, numbers, and hyphens (-) are allowed.");
            } else {
                  setError("");
                  setSubdomain(value);
            }
      };
  
      const handleConfirm = () => {
            if (!subdomain) {
                  setError("Please enter a subdomain.");
                  return;
            }
            if (!error) {
                  alert(`Subdomain confirmed: www.${subdomain}.biznex.site`);
                  // You can replace this with actual submit logic
            }
      };
  
      return (
            <DashboardLayout>
                <div className="p-2 text-[#2F2F2F]">
                    <h1 className="text-lg font-semibold mb-0">Your Ecom Subdomain</h1>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Intro Box */}
                        <div className="bg-white border border-[#2F2F2F] rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-2">Create Your Subdomain</h2>
                            <p className="mb-2">Create a unique web address for your e-commerce store. It will look like this:</p>
                            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                                <code>www.your-chosen-name.biznex.site</code>
                            </div>
                        </div>
    
                        {/* Bento Input + Preview */}
                        <div className="bg-white border border-[#2F2F2F] rounded-xl p-6 shadow-md">
                            <h2 className="text-lg font-semibold mb-4">Choose Your Subdomain</h2>
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Left Input */}
                                <div className="w-full md:w-1/2">
                                    <input
                                        type="text"
                                        value={subdomain}
                                        onChange={handleInputChange}
                                        placeholder="your-name"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F06516]"
                                    />
                                    {error && (
                                          <p className="text-red-500 text-sm mt-2">{error}</p>
                                      )}
                                  </div>
      
                                  {/* Right Preview */}
                                  <div className="w-full md:w-1/2 flex items-center bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm font-mono">
                                      {subdomain ? (
                                            <span>www.<strong>{subdomain}</strong>.biznex.site</span>
                                        ) : (
                                              <span className="text-gray-400">www.your-subdomain.biznex.site</span>
                                          )}
                                      </div>
                                  </div>
          
                                  {/* Confirm Button */}
                                  {/* Confirm Button */}
          <button
              onClick={handleConfirm}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
              disabled={!!error || !subdomain}
          >
              Confirm Subdomain
          </button>
          
                              </div>
                          </div>
                      </div>
                  </DashboardLayout>
              );
        };
        
        export default SubdomainAllocation;
