"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DashboardLayout from '../../components/dashboardlayout';

const JobListings = () => {
    const [jobListings, setJobListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [jobListingFormData, setJobListingFormData] = useState({
        title: '', company: '', location: '', type: '', workType: '', salary: '', description: '', qualifications: ['', ''],
    });
    const [editingJobListingId, setEditingJobListingId] = useState(null);
    const [selectedJobIdForApplications, setSelectedJobIdForApplications] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [rejectConfirmation, setRejectConfirmation] = useState({ show: false, jobId: null, appId: null });
    const popupRef = useRef(null);

    useEffect(() => {
        const fetchJobListings = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push("/login");
                    return;
                }
                const response = await axios.get("https://biznex.onrender.com/job/client/get_jobs_with_applicants", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const jobsArray = response.data.jobs || [];
                const mappedData = jobsArray.map(job => ({
                    id: job.job_id,
                    title: job.title,
                    description: job.description,
                    location: job.location,
                    postedDate: new Date(job.posted_at).toISOString().split('T')[0],
                    company: job.company,
                    type: job.type,
                    workType: job.work_type,
                    salary: job.salary_per_month,
                    qualifications: job.qualifications ? job.qualifications.split(',').map(q => q.trim()) : [],
                    applications: job.applicants ? job.applicants.map(app => ({
                        id: app.job_apply_id,
                        name: app.job_user_name,
                        email: app.email,
                        resume: app.resume,
                    })) : [],
                }));
                setJobListings(mappedData);
            } catch (error) {
                console.error("Error fetching job listings:", error);
                setError("Failed to load job listings. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobListings();
    }, [router]);

    const handleJobListingChange = (e) => {
        if (e.target.name.startsWith('qualification')) {
            const index = parseInt(e.target.name.split('-')[1]);
            const newQualifications = [...jobListingFormData.qualifications];
            newQualifications[index] = e.target.value;
            setJobListingFormData({ ...jobListingFormData, qualifications: newQualifications });
        } else {
            setJobListingFormData({ ...jobListingFormData, [e.target.name]: e.target.value });
        }
    };

    const handleAddJobListing = async () => {
        // Validation logic...
        const errors = {};
        if (!jobListingFormData.title) errors.title = 'Title is required';
        if (!jobListingFormData.company) errors.company = 'Company is required';
        if (!jobListingFormData.location) errors.location = 'Location is required';
        if (!jobListingFormData.type) errors.type = 'Type is required';
        if (!jobListingFormData.workType) errors.workType = 'Work Type is required';
        if (!jobListingFormData.salary) errors.salary = 'Salary is required';
        if (!jobListingFormData.description) errors.description = 'Description is required';
        if (!jobListingFormData.qualifications[0]) errors['qualification-0'] = 'Qualification 1 is required';
        if (!jobListingFormData.qualifications[1]) errors['qualification-1'] = 'Qualification 2 is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        // End validation logic

        const jobPayload = {
            jobtitle: jobListingFormData.title,
            description: jobListingFormData.description,
            location: jobListingFormData.location,
            salary: jobListingFormData.salary,
            company_name: jobListingFormData.company,
            quali_1: jobListingFormData.qualifications[0],
            quali_2: jobListingFormData.qualifications[1],
            type: jobListingFormData.type,
            work_type: jobListingFormData.workType
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("https://biznex.onrender.com/job/client/list_job", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(jobPayload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save job listing');
            }
            const newJob = await response.json();
            const newJobFormatted = {
                id: newJob.job_id,
                ...jobListingFormData,
                postedDate: new Date().toISOString().split('T')[0],
                applications: [],
            };
            setJobListings(prevListings => [newJobFormatted, ...prevListings]);
            setJobListingFormData({ title: '', company: '', location: '', type: '', workType: '', salary: '', description: '', qualifications: ['', ''] });
        } catch (error) {
            console.error('Error saving job listing:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDeleteJobListing = async (id) => {
        if (window.confirm("Are you sure you want to delete this job listing?")) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("https://biznex.onrender.com/job/client/delete_job", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ job_id: id }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete job listing');
                }
                setJobListings(prevListings => prevListings.filter(listing => listing.id !== id));
            } catch (error) {
                console.error("Delete Error:", error);
                alert(`Error deleting job: ${error.message}`);
            }
        }
    };

    const handleEditJobListing = (listing) => {
        setEditingJobListingId(listing.id);
        setJobListingFormData({ title: listing.title, company: listing.company, location: listing.location, type: listing.type, workType: listing.workType, salary: listing.salary, description: listing.description, qualifications: listing.qualifications });
    };

    const handleShowApplications = (jobId) => { setSelectedJobIdForApplications(jobId); };
    const handleCloseApplications = () => { setSelectedJobIdForApplications(null); };

    // --- START: NEW FUNCTION ---
    const handleAcceptApplication = async (jobId, appId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("https://biznex.onrender.com/job/client/update_application_status", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ job_apply_id: appId, status: 'accepted' }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to accept application');
            }
            // On success, remove the applicant from the current view
            setJobListings(prevListings => prevListings.map(listing => {
                if (listing.id === jobId) {
                    return { ...listing, applications: listing.applications.filter(app => app.id !== appId) };
                }
                return listing;
            }));
            alert("Applicant accepted successfully.");
        } catch (error) {
            console.error("Accept Error:", error);
            alert(`Error accepting applicant: ${error.message}`);
        }
    };
    // --- END: NEW FUNCTION ---
    
    const handleRejectApplication = async (jobId, appId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("https://biznex.onrender.com/job/client/update_application_status", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ job_apply_id: appId, status: 'rejected' }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reject application');
            }
            setJobListings(prevListings => prevListings.map(listing => {
                if (listing.id === jobId) {
                    return { ...listing, applications: listing.applications.filter(app => app.id !== appId) };
                }
                return listing;
            }));
            alert("Applicant rejected successfully.");
        } catch (error) {
            console.error("Reject Error:", error);
            alert(`Error rejecting applicant: ${error.message}`);
        }
    };

    const handleRejectClick = (jobId, appId) => { setRejectConfirmation({ show: true, jobId, appId }); };
    const confirmReject = () => { handleRejectApplication(rejectConfirmation.jobId, rejectConfirmation.appId); setRejectConfirmation({ show: false, jobId: null, appId: null }); };
    const cancelReject = () => { setRejectConfirmation({ show: false, jobId: null, appId: null }); };

    useEffect(() => {
        const handleClickOutside = (event) => { if (popupRef.current && !popupRef.current.contains(event.target)) { cancelReject(); } };
        const handleKeyDown = (event) => { if (event.key === 'Escape') { cancelReject(); } };
        if (rejectConfirmation.show) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [rejectConfirmation.show]);

    if (isLoading) {
        return <DashboardLayout><div className="p-6 text-center">Loading job listings...</div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div className="p-6 text-center text-red-500">{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="p-4 text-[#2F2F2F]">
                <h1 className="text-lg font-semibold mb-4">Job Listings</h1>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="w-full lg:w-3/4 flex flex-col gap-4">
                        {jobListings.map((listing) => (
                            <div key={listing.id} className="p-4 border border-[#2F2F2F] rounded-xl">
                                <div className="flex flex-col sm:flex-row justify-between items-start">
                                    <div className="mb-4 sm:mb-0">
                                        <h2 className="text-lg font-semibold">{listing.title}</h2>
                                        <p className="text-sm text-gray-600">Posted: {listing.postedDate}</p>
                                        <p className="mt-2 text-sm"><strong>Company:</strong> {listing.company}</p>
                                        <p className="text-sm"><strong>Location:</strong> {listing.location}</p>
                                        <p className="text-sm"><strong>Type:</strong> {listing.type}</p>
                                        <p className="text-sm"><strong>Work Type:</strong> {listing.workType}</p>
                                        <p className="text-sm"><strong>Salary per Month :</strong> ${listing.salary}</p>
                                        <p className="mt-2 text-sm"><strong>Description:</strong> {listing.description.substring(0, 100)}...</p>
                                        <p className="mt-2 text-sm"><strong>Qualifications:</strong> {listing.qualifications.join(', ')}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button onClick={() => handleShowApplications(listing.id)} className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto">
                                            View Applications ({listing.applications.length})
                                        </button>
                                        <button onClick={() => handleDeleteJobListing(listing.id)} className="p-2 bg-red-500 text-white rounded w-full sm:w-auto">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {selectedJobIdForApplications === listing.id && (
                                    <div className="mt-4">
                                        <h3 className="text-md font-semibold mb-2">Applications</h3>
                                        {listing.applications.length > 0 ? (
                                            <table className="w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border border-gray-300 p-2">Name</th>
                                                        <th className="border border-gray-300 p-2">Email</th>
                                                        <th className="border border-gray-300 p-2">Resume</th>
                                                        <th className="border border-gray-300 p-2">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listing.applications.map((app) => (
                                                        <tr key={app.id}>
                                                            <td className="border border-gray-300 p-2">{app.name}</td>
                                                            <td className="border border-gray-300 p-2">{app.email}</td>
                                                            <td className="border border-gray-300 p-2">
                                                                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Resume</a>
                                                            </td>
                                                            {/* --- START: UPDATED ACTIONS CELL --- */}
                                                            <td className="border border-gray-300 p-2 flex gap-2">
                                                                <button onClick={() => handleAcceptApplication(listing.id, app.id)} className="bg-green-500 hover:bg-green-600 text-white rounded p-1 px-2">Accept</button>
                                                                <button onClick={() => handleRejectClick(listing.id, app.id)} className="bg-red-500 hover:bg-red-600 text-white rounded p-1 px-2">Reject</button>
                                                            </td>
                                                            {/* --- END: UPDATED ACTIONS CELL --- */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>No applications yet.</p>
                                        )}
                                        <button onClick={handleCloseApplications} className="mt-2 p-2 bg-gray-300 rounded w-full">Close</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="w-full lg:w-1/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingJobListingId ? 'Update Job Listing' : 'Add Job Listing'}
                        </h2>
                        <div className="flex flex-col gap-2">
                            <input type="text" name="title" value={jobListingFormData.title} onChange={handleJobListingChange} placeholder="Job Title" className={`p-2 border rounded text-[#2F2F2F] ${formErrors.title ? 'border-red-500' : ''}`} />
                            {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
                            <input type="text" name="company" value={jobListingFormData.company} onChange={handleJobListingChange} placeholder="Company Name" className={`p-2 border rounded text-[#2F2F2F] ${formErrors.company ? 'border-red-500' : ''}`} />
                            {formErrors.company && <p className="text-red-500 text-sm">{formErrors.company}</p>}
                            <input type="text" name="location" value={jobListingFormData.location} onChange={handleJobListingChange} placeholder="Location" className={`p-2 border rounded text-[#2F2F2F] ${formErrors.location ? 'border-red-500' : ''}`} />
                            {formErrors.location && <p className="text-red-500 text-sm">{formErrors.location}</p>}
                            <select name="type" value={jobListingFormData.type} onChange={handleJobListingChange} className={`p-2 border rounded text-[#2F2F2F] ${formErrors.type ? 'border-red-500' : ''}`}>
                                <option value="">Select Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                            {formErrors.type && <p className="text-red-500 text-sm">{formErrors.type}</p>}
                            <select name="workType" value={jobListingFormData.workType} onChange={handleJobListingChange} className={`p-2 border rounded text-[#2F2F2F] ${formErrors.workType ? 'border-red-500' : ''}`}>
                                <option value="">Select Work Type</option>
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            {formErrors.workType && <p className="text-red-500 text-sm">{formErrors.workType}</p>}
                            <input type="number" name="salary" value={jobListingFormData.salary} onChange={handleJobListingChange} placeholder="Salary per Month" className={`p-2 border rounded text-[#2F2F2F] ${formErrors.salary ? 'border-red-500' : ''}`} />
                            {formErrors.salary && <p className="text-red-500 text-sm">{formErrors.salary}</p>}
                            <textarea name="description" value={jobListingFormData.description} onChange={handleJobListingChange} placeholder="Description" className={`p-2 border rounded text-[#2F2F2F] ${formErrors.description ? 'border-red-500' : ''}`} />
                            {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
                            <input type="text" name="qualification-0" value={jobListingFormData.qualifications[0]} onChange={handleJobListingChange} placeholder="Qualification 1" className={`p-2 border rounded text-[#2F2F2F] ${formErrors['qualification-0'] ? 'border-red-500' : ''}`} />
                            {formErrors['qualification-0'] && <p className="text-red-500 text-sm">{formErrors['qualification-0']}</p>}
                            <input type="text" name="qualification-1" value={jobListingFormData.qualifications[1]} onChange={handleJobListingChange} placeholder="Qualification 2" className={`p-2 border rounded text-[#2F2F2F] ${formErrors['qualification-1'] ? 'border-red-500' : ''}`} />
                            {formErrors['qualification-1'] && <p className="text-red-500 text-sm">{formErrors['qualification-1']}</p>}
                            <button onClick={handleAddJobListing} className="mt-2 p-2 bg-blue-500 text-white rounded w-full">
                                {editingJobListingId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {rejectConfirmation.show && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div ref={popupRef} className="bg-white p-6 rounded-lg border border-black shadow-lg">
                        <p>Are you sure you want to reject this applicant?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={confirmReject} className="bg-red-500 text-white rounded p-2 mr-2">Yes, Reject</button>
                            <button onClick={cancelReject} className="bg-gray-300 rounded p-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default JobListings;