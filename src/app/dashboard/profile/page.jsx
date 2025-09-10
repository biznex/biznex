"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DashboardLayout from "../components/dashboardlayout";

function ProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState({
        businessName: "", ownerName: "", businessAddress: "",
        email: "", category: "", phone: "", password: "",
    });

    const [originalProfile, setOriginalProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    // --- START: New state for password confirmation modal ---
    const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    // --- END: New state for password confirmation modal ---

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push("/login");
                    return;
                }
                const GET_PROFILE_API_URL = "https://biznex.onrender.com/user/get_profile";
                const response = await axios.get(GET_PROFILE_API_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const profileData = response.data.profile;
                const mappedData = {
                    businessName: profileData.business_name || "",
                    ownerName: profileData.owner_name || "",
                    businessAddress: profileData.business_address || "",
                    email: profileData.email || "",
                    category: profileData.category || "",
                    phone: profileData.phone || "",
                    password: "",
                };
                setProfile(mappedData);
                setOriginalProfile(mappedData);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
                setError("Could not load your profile. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [router]);

    const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // --- MODIFIED: This now opens the modal ---
    const handleEdit = () => {
        setPasswordConfirmError("");
        setCurrentPassword("");
        setShowPasswordConfirmModal(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfile(originalProfile);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const SAVE_PROFILE_API_URL = "https://biznex.onrender.com/user/update_profile";
            const payload = {
                business_name: profile.businessName,
                owner_name: profile.ownerName,
                business_address: profile.businessAddress,
                email: profile.email,
                category: profile.category,
                phone: profile.phone,
            };
            if (profile.password) {
                payload.password = profile.password;
            }
            await axios.post(SAVE_PROFILE_API_URL, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Profile updated successfully!");
            const newProfileState = { ...profile, password: "" };
            setOriginalProfile(newProfileState);
            setProfile(newProfileState);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert(err.response?.data?.message || "An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- START: New functions for the modal ---
    const handleConfirmPassword = async () => {
        setIsSaving(true);
        setPasswordConfirmError("");
        try {
            const token = localStorage.getItem('token');
            // **REPLACE WITH YOUR PASSWORD CONFIRMATION API ENDPOINT**
            const CONFIRM_PASSWORD_URL = "https://biznex.onrender.com/user/confirm-password";
            
            await axios.post(CONFIRM_PASSWORD_URL, 
                { password: currentPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // On success, close the modal and enable editing
            setShowPasswordConfirmModal(false);
            setIsEditing(true);

        } catch (err) {
            setPasswordConfirmError(err.response?.data?.message || "Incorrect password. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseConfirmModal = () => {
        setShowPasswordConfirmModal(false);
    };
    // --- END: New functions for the modal ---

    if (isLoading) {
        return <DashboardLayout><div className="text-center p-10">Loading profile...</div></DashboardLayout>;
    }
    if (error) {
        return <DashboardLayout><div className="text-center p-10 text-red-500">{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto p-6 text-black">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* All inputs are disabled based on the isEditing state */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Business Name</label>
                        <input type="text" name="businessName" value={profile.businessName} onChange={handleChange} disabled={!isEditing} placeholder="Business Name" className="border border-gray-300 rounded px-3 py-2 text-black disabled:bg-gray-100 disabled:cursor-not-allowed" />
                    </div>
                    {/* ... other input fields ... */}
                     <div className="flex flex-col">
                         <label className="mb-1 font-medium">Owner Name</label>
                         <input type="text" name="ownerName" value={profile.ownerName} onChange={handleChange} disabled={!isEditing} placeholder="Owner Name" className="border border-gray-300 rounded px-3 py-2 text-black disabled:bg-gray-100 disabled:cursor-not-allowed" />
                     </div>
                     <div className="flex flex-col md:col-span-2">
                         <label className="mb-1 font-medium">Business Address</label>
                         <input type="text" name="businessAddress" value={profile.businessAddress} onChange={handleChange} disabled={!isEditing} placeholder="Business Address" className="border border-gray-300 rounded px-3 py-2 text-black disabled:bg-gray-100 disabled:cursor-not-allowed" />
                     </div>
                     <div className="flex flex-col">
                         <label className="mb-1 font-medium">Email</label>
                         <input type="email" name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} placeholder="Email" className="border border-gray-300 rounded px-3 py-2 text-black disabled:bg-gray-100 disabled:cursor-not-allowed" />
                     </div>
                     <div className="flex flex-col">
                         <label className="mb-1 font-medium">Business Category</label>
                         <select name="category" value={profile.category} onChange={handleChange} disabled={!isEditing} className="border border-gray-300 rounded px-3 py-2 text-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed">
                             <option value="" disabled>Select Business Category</option>
                             <option value="Retail & Ecommerce">Retail & Ecommerce</option>
                             <option value="Education">Education</option>
                             <option value="Consultation">Consultation</option>
                             <option value="Services">Services</option>
                             <option value="Food">Food</option>
                             <option value="Other">Other</option>
                         </select>
                     </div>
                     <div className="flex flex-col">
                         <label className="mb-1 font-medium">Phone</label>
                         <input type="tel" name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} placeholder="Phone" className="border border-gray-300 rounded px-3 py-2 text-black disabled:bg-gray-100 disabled:cursor-not-allowed" />
                     </div>
                     <div className="flex flex-col">
                         <label className="mb-1 font-medium">New Password</label>
                         <input type="password" name="password" value={profile.password} onChange={handleChange} disabled={!isEditing} placeholder="Leave blank to keep current password" className="border border-gray-300 rounded px-3 py-2 text-black disabled:bg-gray-100 disabled:cursor-not-allowed" />
                     </div>
                </div>

                <div className="mt-6 flex gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} disabled={!hasChanges || isSaving} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <button onClick={handleCancel} disabled={hasChanges} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className="bg-[#5D46E7] text-white px-6 py-2 rounded hover:bg-[#4a36c7]">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
            
            {/* --- START: Password Confirmation Modal --- */}
            {showPasswordConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm border-2 border-black">
                        <h2 className="text-lg font-semibold mb-4">Confirm Your Password</h2>
                        <p className="text-sm text-gray-600 mb-4">To edit your profile, please enter your current password.</p>
                        
                        {passwordConfirmError && <p className="text-red-500 text-sm mb-4">{passwordConfirmError}</p>}

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-sm">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="border border-gray-300 rounded px-3 py-2 text-black"
                            />
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={handleCloseConfirmModal} disabled={isSaving} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50">
                                Cancel
                            </button>
                             <button onClick={handleConfirmPassword} disabled={isSaving || !currentPassword} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                                {isSaving ? "Verifying..." : "Proceed"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- END: Password Confirmation Modal --- */}
        </DashboardLayout>
    );
}

export default ProfilePage;