"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SubdomainAllocation = () => {
    const [subdomain, setSubdomain] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    // 1. New state to manage the locked/unlocked UI
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubdomain = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("https://biznex.onrender.com/subdomainname/subdomainname", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                });
                
                if (response.status === 200 && response.data.subdomain) {
                    setSubdomain(response.data.subdomain);
                    setIsConfirmed(true);
                    setIsEditing(false); // Subdomain exists, start in locked mode
                } else {
                    setIsEditing(true); // No subdomain, start in editing mode
                }

            } catch (error) {
                console.error("Error fetching subdomain:", error);
                setError("Failed to fetch subdomain. Please try again later.");
                setIsEditing(true); // Allow user to try entering one if fetch fails
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubdomain();
    }, [router]);


    const handleInputChange = (e) => {
        setIsConfirmed(false); // Always reset confirmation when typing
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

    const handleConfirm = async () => {
        const token = localStorage.getItem('token');
        if (!subdomain) {
            setError("Subdomain cannot be empty.");
            return;
        }
        
        const response = await fetch('https://biznex.onrender.com/subdomainname/subdomainin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ subdomain: subdomain }),
        });
        
        if (response.ok) {
            alert('Subdomain confirmed successfully!');
            setIsConfirmed(true);
            setIsEditing(false); // Lock the input field on success
            setError("");
        } else if (response.status === 400) {
            const data = await response.json();
            setError(data.message || 'Subdomain is already taken. Please choose another one.');
        } else {
            setError('An error occurred. Please try again later.');
        }
    };
    
    // 2. New handler to unlock the input field
    const handleEditClick = () => {
        setIsEditing(true);
        setIsConfirmed(false);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="p-6 text-center">Loading your subdomain settings...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-2 text-[#2F2F2F]">
                <h1 className="text-lg font-semibold mb-0">Your Ecom Subdomain</h1>
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white border border-[#2F2F2F] rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-2">Create Your Subdomain</h2>
                        <p className="mb-2">Create a unique web address for your e-commerce store. It will look like this:</p>
                        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                            <code>www.your-chosen-name.biznex.site</code>
                        </div>
                    </div>

                    <div className="bg-white border border-[#2F2F2F] rounded-xl p-6 shadow-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {isEditing ? "Choose Your Subdomain" : "Your Confirmed Subdomain"}
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/2">
                                <input
                                    type="text"
                                    value={subdomain}
                                    onChange={handleInputChange}
                                    placeholder="your-name"
                                    // 3. Input is now disabled when not in editing mode
                                    disabled={!isEditing}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F06516] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                {error && (
                                    <p className="text-red-500 text-sm mt-2">{error}</p>
                                )}
                            </div>

                            <div className="w-full md:w-1/2 flex items-center bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm font-mono">
                                {isConfirmed ? (
                                    <a href={`https://www.${subdomain}.biznex.site`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        www.<strong>{subdomain}</strong>.biznex.site
                                    </a>
                                ) : (
                                    subdomain ? (
                                        <span>www.<strong>{subdomain}</strong>.biznex.site</span>
                                    ) : (
                                        <span className="text-gray-400">www.your-subdomain.biznex.site</span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* 4. Conditionally render Confirm or Edit button */}
                        <div className="mt-4">
                            {isEditing ? (
                                <button
                                    onClick={handleConfirm}
                                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-400"
                                    disabled={!!error || !subdomain}
                                >
                                    Confirm Subdomain
                                </button>
                            ) : (
                                <button
                                    onClick={handleEditClick}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    Edit Subdomain
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SubdomainAllocation;