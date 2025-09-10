"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import JobDashboardHeader from './component/jobdashboardheader';

export default function JobListingsPage() {
    const [jobListings, setJobListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [locationFilter, setLocationFilter] = useState('');
    const [fullTimeFilter, setFullTimeFilter] = useState(false);
    const [partTimeFilter, setPartTimeFilter] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [salaryRange, setSalaryRange] = useState([0, 150000]);
    const [workTypeFilter, setWorkTypeFilter] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [userData, setUserData] = useState({ resume: null });
    const [resumeFileName, setResumeFileName] = useState("Choose File");
    const [applyJobPopup, setApplyJobPopup] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [canConfirm, setCanConfirm] = useState(false);
    const [userDataError, setUserDataError] = useState(null);
    const [applicationSent, setApplicationSent] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('jtoken');
                if (!token) {
                    router.push("/login");
                    return;
                }
                const response = await axios.get("https://biznex.onrender.com/job/user/get_job_list", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const jobsArray = response.data.jobs || [];
                const mappedData = jobsArray.map(job => ({
                    id: job.job_id,
                    title: job.job_title,
                    company: job.company_name,
                    location: job.location || 'Not specified',
                    type: job.job_type,
                    workType: job.work_type,
                    salary: parseInt(job.salary_range, 10) || 0,
                    description: job.description,
                    qualifications: [job.quali_1, job.quali_2].filter(Boolean),
                }));
                setJobListings(mappedData);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setJobListings([]);
                } else {
                    console.error("Error fetching jobs:", err);
                    setError("Failed to load job listings.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [router]);

    const uniqueLocations = [...new Set(jobListings.map((listing) => listing.location))];

    const filteredListings = jobListings.filter((listing) => {
        const locationMatch = !locationFilter || (listing.location && listing.location.toLowerCase().includes(locationFilter.toLowerCase()));
        const salaryMatch = listing.salary >= salaryRange[0] && listing.salary <= salaryRange[1];
        const workTypeMatch = workTypeFilter.length === 0 || workTypeFilter.includes(listing.workType);
        const typeMatch = (!fullTimeFilter && !partTimeFilter) || (fullTimeFilter && listing.type === 'Full-time') || (partTimeFilter && listing.type === 'Part-time');
        return locationMatch && salaryMatch && workTypeMatch && typeMatch;
    });

    const handleLocationInputChange = (e) => { setLocationFilter(e.target.value); setShowLocationDropdown(true); };
    const handleLocationSelect = (location) => { setLocationFilter(location); setShowLocationDropdown(false); };
    const clearFilters = () => { setLocationFilter(''); setFullTimeFilter(false); setPartTimeFilter(false); setSalaryRange([0, 150000]); setWorkTypeFilter([]); };
    const handleWorkTypeChange = (type) => { setWorkTypeFilter(prev => prev.includes(type) ? prev.filter(item => item !== type) : [...prev, type]); };
    const handleUserDataChange = (e) => {
        const file = e.target.files[0];
        setUserData({ resume: file });
        setResumeFileName(file ? file.name : "Choose File");
    };
    
    // --- THIS IS THE FIX ---
    // Removed the stray 'set' that was causing a syntax error.
    const handleSingleFileUpload = async (file) => {
        if (!file) return null;
        try {
            const response = await fetch(`https://biznex.onrender.com/s3up/generate-upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`, { method: 'GET', mode: 'cors' });
            if (!response.ok) throw new Error('Failed to get upload URL.');
            const { uploadURL, key } = await response.json();
            const uploadResponse = await fetch(uploadURL, { method: 'PUT', body: file });
            if (!uploadResponse.ok) throw new Error('Failed to upload to S3.');
            const fileURL = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
            console.log('✅ File uploaded successfully:', fileURL);
            return fileURL;
        } catch (error) {
            console.error('❌ Error uploading file:', error);
            alert('File upload failed. Please try again.');
            return null;
        }
    };

    const handleUserDataSubmit = async () => {
        if (!canConfirm) { setUserDataError("Please select a resume to upload."); return; }
        setUserDataError(null);
        setIsSubmitting(true);
        try {
            const resumeUrl = await handleSingleFileUpload(userData.resume);
            if (!resumeUrl) { setIsSubmitting(false); return; }
            const applicationPayload = { job_id: selectedJob.id, fileurl: resumeUrl };
            const token = localStorage.getItem('jtoken');
            const response = await axios.post("https://biznex.onrender.com/job/user/apply_job", applicationPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data && response.data.success) {
                alert('Application submitted successfully!');
                setJobListings(prevListings => prevListings.filter(job => job.id !== selectedJob.id));
                setApplyJobPopup(false);
                setApplicationSent(prevSent => ({ ...prevSent, [selectedJob.id]: true }));
            } else {
                alert(response.data.message || 'Failed to submit application.');
            }
        } catch (error) {
            console.error('Application submission failed:', error);
            alert(error.response?.data?.message || 'An error occurred while submitting your application.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApplyJob = (job) => {
        setSelectedJob(job);
        setApplyJobPopup(true);
        setUserData({ resume: null });
        setResumeFileName("Choose File");
    };

    useEffect(() => {
        setCanConfirm(!!userData.resume);
    }, [userData]);
    
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading job listings...</div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-[#FEFEFF] text-black">
            <JobDashboardHeader />
            <div className="flex flex-1 overflow-hidden">
                <aside className={`w-full md:w-64 p-4 border-r border-gray-300 overflow-y-auto ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" value={locationFilter} onChange={handleLocationInputChange} className="mt-1 p-2 border border-gray-300 rounded-md w-full" onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)} onFocus={() => setShowLocationDropdown(true)} />
                        {showLocationDropdown && (
                            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                                {uniqueLocations.filter((loc) => loc.toLowerCase().includes(locationFilter.toLowerCase())).map((location) => (
                                    <div key={location} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLocationSelect(location)}>{location}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <div className="flex flex-col">
                            <label className="inline-flex items-center mb-2"><input type="checkbox" checked={fullTimeFilter} onChange={() => setFullTimeFilter(!fullTimeFilter)} className="form-checkbox h-5 w-5 text-indigo-600" /><span className="ml-2 text-sm text-gray-700">Full-time</span></label>
                            <label className="inline-flex items-center"><input type="checkbox" checked={partTimeFilter} onChange={() => setPartTimeFilter(!partTimeFilter)} className="form-checkbox h-5 w-5 text-indigo-600" /><span className="ml-2 text-sm text-gray-700">Part-time</span></label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                        <Slider range min={0} max={150000} defaultValue={[0, 150000]} value={salaryRange} onChange={(value) => setSalaryRange(value)} />
                        <div className="mt-2 text-sm">{`$${salaryRange[0]} - $${salaryRange[1]}`}</div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Work Type</label>
                        <div className="flex flex-col">
                            <label className="inline-flex items-center mb-2"><input type="checkbox" checked={workTypeFilter.includes('Remote')} onChange={() => handleWorkTypeChange('Remote')} className="form-checkbox h-5 w-5 text-indigo-600" /><span className="ml-2 text-sm text-gray-700">Remote</span></label>
                            <label className="inline-flex items-center mb-2"><input type="checkbox" checked={workTypeFilter.includes('On-site')} onChange={() => handleWorkTypeChange('On-site')} className="form-checkbox h-5 w-5 text-indigo-600" /><span className="ml-2 text-sm text-gray-700">On-site</span></label>
                            <label className="inline-flex items-center"><input type="checkbox" checked={workTypeFilter.includes('Hybrid')} onChange={() => handleWorkTypeChange('Hybrid')} className="form-checkbox h-5 w-5 text-indigo-600" /><span className="ml-2 text-sm text-gray-700">Hybrid</span></label>
                        </div>
                    </div>
                    <button onClick={clearFilters} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md w-full">Clear Filters</button>
                </aside>
                <main className="flex-1 p-4 overflow-y-auto">
                    <button className="md:hidden mb-4 bg-gray-200 p-2 rounded" onClick={() => setShowFilters(!showFilters)}><FaBars className="text-xl" /><span className="ml-2">Show Filters</span></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobListings.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 mt-10">
                                <h3 className="text-xl font-semibold">No jobs are currently listed.</h3>
                                <p className="mt-2">Please check again later or see your application status in the 'My Applications' section.</p>
                            </div>
                        ) : filteredListings.length > 0 ? (
                            filteredListings.map((listing) => (
                                <div key={listing.id} className="border border-gray-300 rounded-md p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <h2 className="text-lg font-semibold">{listing.title}</h2>
                                    <p className="text-sm text-gray-600">{listing.company}</p>
                                    <p className="mt-2">Location: {listing.location}</p>
                                    <p>Type: {listing.type}</p>
                                    <p className="mt-2">Salary: ${listing.salary}</p>
                                    <p className="mt-2">Work Type: {listing.workType}</p>
                                    <p className="mt-2">Description: {listing.description}</p>
                                    <p className="mt-2">Qualifications:</p>
                                    <ul className="list-disc list-inside">
                                        {listing.qualifications.map((qualification, index) => (
                                            <li key={index} className="text-sm">{qualification}</li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleApplyJob(listing)}
                                        className={`mt-4 w-full ${applicationSent[listing.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded transition-colors`}
                                        disabled={applicationSent[listing.id]}
                                    >
                                        {applicationSent[listing.id] ? 'Applied' : 'Apply for Job'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No job listings found that match your criteria.</p>
                        )}
                    </div>
                </main>
            </div>
            {applyJobPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md border-2 border-black">
                        <h2 className="text-lg font-semibold mb-4">Apply for {selectedJob?.title}</h2>
                        {userDataError && (<p className="text-red-500 mb-4">{userDataError}</p>)}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF only)</label>
                            <div className="relative">
                                <input type="file" name="resume" accept=".pdf" onChange={(e) => {
                                    if (e.target.files[0] && e.target.files[0].type !== 'application/pdf') {
                                        alert('Please upload a PDF file.'); e.target.value = null; setResumeFileName("Choose File"); setUserData({ resume: null });
                                    } else { handleUserDataChange(e); }
                                }} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" id="resumeUpload" required />
                                <label htmlFor="resumeUpload" className="mt-1 p-2 border border-gray-300 rounded-md w-full cursor-pointer bg-gray-100 flex items-center justify-between">
                                    <span className="truncate flex-grow">{resumeFileName}</span>
                                    <span className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">Upload</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleUserDataSubmit}
                                className={`bg-blue-500 text-white px-4 py-2 rounded ${canConfirm ? "hover:bg-blue-600" : "opacity-50 cursor-not-allowed"}`}
                                disabled={!canConfirm || isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send My Details'}
                            </button>
                            <button onClick={() => setApplyJobPopup(false)} disabled={isSubmitting} className="bg-gray-300 text-gray-800 px-4 py-2 rounded ml-2 hover:bg-gray-400 disabled:opacity-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 