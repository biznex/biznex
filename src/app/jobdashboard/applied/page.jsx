"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import JobDashboardHeader from "../component/jobdashboardheader";


// Central configuration for application statuses
const statusConfig = {
  pending: {
    text: "Under Review",
    classes: "bg-blue-100 text-blue-800",
  },
  accepted: {
    text: "Interview Scheduled",
    classes: "bg-green-100 text-green-800",
  },
  rejected: {
    text: "Rejected",
    classes: "bg-red-100 text-red-800",
  },
  withdrawn: {
    text: "Application Withdrawn",
    classes: "bg-orange-100 text-orange-800",
  },
};


export default function AppliedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState("");
  const [withdrawPopup, setWithdrawPopup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jtoken');
        if (!token) {
          router.push("/login");
          return;
        }

        const API_URL = "https://biznex.onrender.com/job/user/get_applied_jobs";
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const jobsArray = response.data.applied_jobs || [];

        const mappedData = jobsArray.map(job => ({
          id: job.job_apply_id,
          title: job.job_title,
          company: job.company_name,
          appliedDate: new Date(job.applied_at).toLocaleDateString(),
          // Use the normalized status key directly from the API
          status: job.application_status 
        }));

        setJobs(mappedData);

      } catch (err) {
        if (err.response && err.response.status === 404) {
            setJobs([]); 
        } else {
            console.error("Failed to fetch applied jobs:", err);
            setError("Could not load your applied jobs. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [router]);

  const filteredJobs = jobs.filter((job) =>
    statusFilter ? job.status === statusFilter : true
  );

  const clearFilters = () => {
    setStatusFilter("");
  };

  const handleWithdrawClick = (job) => {
    setSelectedJob(job);
    setWithdrawPopup(true);
  };

  const confirmWithdraw = async () => {
    if (!selectedJob) return;
    try {
      const token = localStorage.getItem('jtoken');
      const WITHDRAW_API_URL = "https://biznex.onrender.com/job/user/update_application_status";

      await axios.post(
        WITHDRAW_API_URL,
        { job_apply_id: selectedJob.id , status: 'withdrawn' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === selectedJob.id
            ? { ...job, status: "withdrawn" } // Update status to the normalized key
            : job
        )
      );
      alert("Application withdrawn successfully.");
    } catch (err) {
      console.error("Failed to withdraw application:", err);
      alert(err.response?.data?.message || "Could not withdraw application. Please try again.");
    } finally {
      setWithdrawPopup(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFEFF] text-black w-full">
            <JobDashboardHeader />
            <div className="flex flex-1 justify-center items-center">Loading your applications...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFEFF] text-black w-full">
            <JobDashboardHeader />
            <div className="flex flex-1 justify-center items-center text-red-500">{error}</div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFF] text-black w-full">
      <JobDashboardHeader />
      <div className="flex flex-1 w-full">
        <aside className={`w-full md:w-64 p-6 border-r border-gray-300 bg-white overflow-y-auto`}>
          <h2 className="text-xl font-semibold mb-6">Filter Applied Jobs</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              {/* Use the config object to populate filter options */}
              {Object.entries(statusConfig).map(([key, { text }]) => (
                <option key={key} value={key}>{text}</option>
              ))}
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md"
          >
            Clear Filters
          </button>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto w-full">
          <div className="flex flex-wrap justify-center gap-6">
            {jobs.length === 0 ? (
                <p className="text-center text-gray-500 w-full">You have not applied for any jobs yet.</p>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const statusInfo = statusConfig[job.status] || { text: job.status, classes: 'bg-gray-100 text-gray-800' };
                return (
                    <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col justify-between w-full sm:w-80 relative">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                            <p className="text-gray-600 mt-1">{job.company}</p>
                            <p className="mt-2 text-sm text-gray-500">Applied On: {job.appliedDate}</p>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.classes}`}>
                                {statusInfo.text}
                            </span>
                            {job.status === "pending" && (
                                <button
                                onClick={() => handleWithdrawClick(job)}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                Withdraw Application
                                </button>
                            )}
                        </div>
                        {job.status === "withdrawn" && (
                            <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none">
                                <span className="text-6xl font-bold text-gray-400 rotate-12">✖</span>
                            </div>
                        )}
                    </div>
                );
              })
            ) : (
                <p className="text-center text-gray-500 w-full">No applied jobs found matching the filter.</p>
            )}
          </div>
        </main>
      </div>
      {withdrawPopup && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md border-2 border-black">
            <h2 className="text-lg font-semibold mb-4">Confirm Withdrawal</h2>
            <p className="mb-4">
              Are you sure you want to withdraw your application for <strong>{selectedJob.title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={confirmWithdraw}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Withdraw
              </button>
              <button
                onClick={() => setWithdrawPopup(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}