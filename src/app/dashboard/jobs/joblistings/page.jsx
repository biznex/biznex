"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from '../../components/dashboardlayout';

const JobListings = () => {
    const [jobListings, setJobListings] = useState([
        {
            id: 1,
            title: 'Software Engineer',
            description: 'We are looking for a skilled software engineer...',
            skills: 'JavaScript, React, Node.js',
            location: 'Remote',
            postedDate: '2023-10-26',
            applications: [
                { id: 101, name: 'Alice', email: 'alice@example.com', resume: '/resumes/alice.pdf' },
                { id: 102, name: 'Bob', email: 'bob@example.com', resume: '/resumes/bob.pdf' },
            ],
            company: 'Tech Innovations Inc.',
            type: 'Full-time',
            workType: 'Remote',
            salary: 100000,
            qualifications: ['Bachelor\'s degree in Computer Science', '3+ years of experience'],
        },
        {
            id: 2,
            title: 'Marketing Manager',
            description: 'Seeking a creative marketing manager to lead our team...',
            skills: 'Digital Marketing, SEO, Social Media',
            location: 'New York',
            postedDate: '2023-10-25',
            applications: [
                { id: 103, name: 'Charlie', email: 'charlie@example.com', resume: '/resumes/charlie.pdf' },
            ],
            company: 'Marketing Solutions Group',
            type: 'Full-time',
            workType: 'Hybrid',
            salary: 90000,
            qualifications: ['Bachelor\'s degree in Marketing', '5+ years of experience'],
        },
    ]);

    const [jobListingFormData, setJobListingFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: '',
        workType: '',
        salary: '',
        description: '',
        qualifications: ['', ''],
    });

    const [editingJobListingId, setEditingJobListingId] = useState(null);
    const [selectedJobIdForApplications, setSelectedJobIdForApplications] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const [rejectConfirmation, setRejectConfirmation] = useState({
        show: false,
        jobId: null,
        appId: null,
    });
    const popupRef = useRef(null);

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

    const handleAddJobListing = () => {
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

        if (editingJobListingId) {
            setJobListings(jobListings.map((listing) =>
                listing.id === editingJobListingId ? { ...listing, ...jobListingFormData } : listing
            ));
            setEditingJobListingId(null);
        } else {
            setJobListings([...jobListings, {
                id: Date.now(),
                ...jobListingFormData,
                postedDate: new Date().toISOString().split('T')[0],
                applications: [],
            }]);
        }
        setJobListingFormData({
            title: '',
            company: '',
            location: '',
            type: '',
            workType: '',
            salary: '',
            description: '',
            qualifications: ['', ''],
        });
    };

    const handleDeleteJobListing = (id) => {
        setJobListings(jobListings.filter((listing) => listing.id !== id));
        if (editingJobListingId === id) {
            setEditingJobListingId(null);
            setJobListingFormData({
                title: '',
                company: '',
                location: '',
                type: '',
                workType: '',
                salary: '',
                description: '',
                qualifications: ['', ''],
            });
        }
    };

    const handleEditJobListing = (listing) => {
        setEditingJobListingId(listing.id);
        setJobListingFormData({
            title: listing.title,
            company: listing.company,
            location: listing.location,
            type: listing.type,
            workType: listing.workType,
            salary: listing.salary,
            description: listing.description,
            qualifications: listing.qualifications,
        });
    };

    const handleShowApplications = (jobId) => {
        setSelectedJobIdForApplications(jobId);
    };

    const handleCloseApplications = () => {
        setSelectedJobIdForApplications(null);
    };

    const handleRejectApplication = (jobId, appId) => {
        setJobListings(jobListings.map(job => {
            if (job.id === jobId) {
                return {
                    ...job,
                    applications: job.applications.filter(app => app.id !== appId)
                };
            }
            return job;
        }));
    };

    const handleRejectClick = (jobId, appId) => {
        setRejectConfirmation({ show: true, jobId, appId });
    };

    const confirmReject = () => {
        handleRejectApplication(rejectConfirmation.jobId, rejectConfirmation.appId);
        setRejectConfirmation({ show: false, jobId: null, appId: null });
    };

    const cancelReject = () => {
        setRejectConfirmation({ show: false, jobId: null, appId: null });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                cancelReject();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                cancelReject();
            }
        };

        if (rejectConfirmation.show) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [rejectConfirmation.show]);

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
                                        <p className="mt-2 text-sm">{listing.description.substring(0, 100)}...</p>
                                        <p className="mt-2 text-sm"><strong>Qualifications:</strong> {listing.qualifications.join(', ')}</p>
                                    </div>
                                    <button onClick={() => handleShowApplications(listing.id)} className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto">
                                        View Applications ({listing.applications.length})
                                    </button>
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
                                                                <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                                                            </td>
                                                            <td className="border border-gray-300 p-2">
                                                                <button onClick={() => handleRejectClick(listing.id, app.id)} className="bg-red-500 text-white rounded p-1">Reject</button>
                                                            </td>
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
                <div className="fixed inset-0 flex justify-center items-center">
                    <div ref={popupRef} className="bg-white p-6 rounded-lg border border-black">
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