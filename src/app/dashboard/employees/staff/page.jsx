"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const EmployeesStaff = () => {
 
  const [staff, setStaff] = useState([]); // State to hold employee data from API
  const [staffFormData, setStaffFormData] = useState({
    firstName: '',
    lastName: '',
    joinDate: '',
    role: '',
    bankAccountNo: '',
    bankName: '',
    bankIfsc: '',
    salary: '',
    email: '',
    phone: '',
  });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const router = useRouter(); // Initialize router

  // Function to fetch employee data from the API
  const fetchStaffData = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://biznex.onrender.com/employee/employees', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("API Response:", response.data);
        

        if (response.status >= 200 && response.status < 300) {
          const staffData = response.data.employees.map((item) => ({
            
            id : item.id,
          firstName: item.first_name,
          lastName: item.last_name,
          joinDate: item.joining_date,
          role: item.position,
          bankAccountNo: item.bank_account_number,
          bankName: item.bank_name,
          bankIfsc: item.ifsc_code,
          salary: parseFloat(item.salary),
          email: item.email,
          phone: item.phone,
          }));
        
          setStaff(staffData);
        }
        console.log(staff);
    } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 401) {
            alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
            router.push("/login");
        } else {
            console.error("Error fetching data:", error);
        }
    }
};

  useEffect(() => {
    fetchStaffData(); // Fetch data when component mounts
  }, [router]); // Add router as dependency

  const handleStaffChange = (e) => {
    setStaffFormData({ ...staffFormData, [e.target.name]: e.target.value });
  };

  const handleAddStaff = async () => {
    try {
    if (editingStaffId) {
        setStaff(staff.map((item) =>
          item.id === editingStaffId ? { ...item, ...staffFormData } : item
        ));
        setEditingStaffId(null);
    }else{
      const token = localStorage.getItem('token');
      const response = await axios.post('https://biznex.onrender.com/employee/employees/add',
        {
          first_name : staffFormData.firstName,
          last_name : staffFormData.lastName,
          email : staffFormData.email, 
          phone : staffFormData.phone, 
          position : staffFormData.role ,
          salary : staffFormData.salary, 
          bank_name : staffFormData.bankName, 
          bank_account_number : staffFormData.bankAccountNo, 
          ifsc_code : staffFormData.bankIfsc,
          joining_date : staffFormData.joinDate
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        }
      );
      const data = response.data; // Access data from response.data for axios
            console.log(data);

            if (response.status >= 200 && response.status < 300 ) { // Check for successful status codes
                console.log('Employee added successfully', data);
                alert('Employee added successfully');
                window.location.reload();
            } else {
                console.error('Failed to add employee:', response.statusText);
            }
        setStaffFormData({
          firstName: '',
          lastName: '',
          joinDate: '',
          role: '',
          bankAccountNo: '',
          bankName: '',
          bankIfsc: '',
          salary: '',
          email: '',
          phone: '',
         });}
    } catch (error) {
      if (error.status === 409) {
        alert('Email or Phone Number or Bank Account Number already in use.Provide a different one'); 
      }
        console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateStaff = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `https://biznex.onrender.com/employee/employees/update`,
            {
                id: id,
                first_name: staffFormData.firstName,
                last_name: staffFormData.lastName,
                email: staffFormData.email,
                phone: staffFormData.phone,
                position: staffFormData.role,
                salary: staffFormData.salary,
                bank_name: staffFormData.bankName,
                bank_account_number: staffFormData.bankAccountNo,
                ifsc_code: staffFormData.bankIfsc,
                joining_date: staffFormData.joinDate,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
        const data = response.data;
        console.log(data);
        if (response.status >= 200 && response.status < 300) {
            console.log('Employees updated successfully', data);
            window.location.reload();
            setStaff(staff.map((item) =>
                item.id === id ? { ...item, ...staffFormData } : item
            ));
            setEditingStaffId(null);
            setStaffFormData({
                firstName: '',
                lastName: '',
                joinDate: '',
                role: '',
                bankAccountNo: '',
                bankName: '',
                bankIfsc: '',
                salary: '',
                email: '',
                phone: '',
            });
        } 
        else {
            console.error('Failed to update employees:', response.statusText);
        }
    } catch (error) {
      if (error.status === 409) {
        alert('Email or Phone Number or Bank Account Number already in use.Provide a different one'); 
      }
        console.error('Error updating employees:', error);
        // Handle network errors or other exceptions
    }
};

  const handleDeleteStaff = async (id) => {
    if (!id) {
        alert('Error: Employee ID is missing.'); // More specific alert
        return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this employee?'); // Renamed variable for clarity
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem('token');

        // --- FIX: Pass ID in the URL ---
        const response = await axios.post(
            `https://biznex.onrender.com/employee/delete-employee`,
            {
              id: id
            }, // Append ID to URL
            // The config object is now the second argument
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
                // If your backend *still* requires the ID in the body (unlikely with URL param):
                
            }
        );

        console.log('Delete API Response:', response.data); // Log response data

        // You can rely on Axios throwing an error for non-2xx status codes,
        // simplifying the success check. Handle errors in the catch block.
        setStaff((prev) => prev.filter((item) => item.id !== id));
        alert('Employee deleted successfully');

    } catch (error) {
        console.error('Error deleting employee:', error);

        // Provide more specific feedback based on error response
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            if (status === 404) {
                alert('Employee not found. It might have already been deleted.');
            } else if (status === 401 || status === 403) {
                alert('Unauthorized: You do not have permission to delete this employee.');
                // Optionally redirect to login if 401
                // if (status === 401) router.push('/login');
            } else if (status >= 500) {
                alert('Server error. Please try again later.');
            } else {
                // General backend error message if available
                alert(`Failed to delete employee. Status: ${status}. ${error.response.data?.message || ''}`);
            }
        } else {
            // Network or other errors
            alert('An error occurred while trying to delete the employee. Please check your connection or try again.');
        }
    }
};

  const handleEditStaff = (employee) => {
    setEditingStaffId(employee.id);
    const formatDate = (dateString) => {
      if (!dateString) return ''; // Handle null or undefined dates
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };
    setStaffFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      joinDate: formatDate(employee.joinDate),
      role: employee.role,
      bankAccountNo: employee.bankAccountNo,
      bankName: employee.bankName,
      bankIfsc: employee.bankIfsc,
      salary: employee.salary.toString(),
      email: employee.email,
      phone: employee.phone,
    });
  };

  const handleCancelEditStaff = () => {
    setEditingStaffId(null);
    setStaffFormData({
      firstName: '',
      lastName: '',
      joinDate: '',
      role: '',
      bankAccountNo: '',
      bankName: '',
      bankIfsc: '',
      salary: '',
      email: '',
      phone: '',

    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 text-[#2F2F2F]">
        <h1 className="text-lg font-semibold mb-4">Staff</h1>
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="w-full lg:w-3/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Employee Details</h2>
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        {/* ... your thead content ... */}
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">Sl. No</th>
                          <th className="border border-gray-300 p-2">First Name</th>
                          <th className="border border-gray-300 p-2">Last Name</th>
                          <th className="border border-gray-300 p-2">Join Date</th>
                          <th className="border border-gray-300 p-2">Role</th>
                          <th className="border border-gray-300 p-2">Bank Account No.</th>
                          <th className="border border-gray-300 p-2">Bank Name</th>
                          <th className="border border-gray-300 p-2">Bank IFSC</th>
                          <th className="border border-gray-300 p-2">Salary</th>
                          <th className="border border-gray-300 p-2">Email</th>
                          <th className="border border-gray-300 p-2">Phone</th>
                          <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* ---- START: Added Check ---- */}
                        
                          {staff.map((employee , index) => (
                            <tr key={index}>
                              {/* Ensure employee object exists and has properties */}
                              <td className="border border-gray-300 p-2">{index +1}</td>
                              <td className="border border-gray-300 p-2">{employee?.firstName ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">{employee?.lastName ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">{employee?.joinDate ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">{employee?.role ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">{employee?.bankAccountNo ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">{employee?.bankName ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">{employee?.bankIfsc ?? 'N/A'}</td>
                              {/* Add nullish coalescing for salary too if it might be missing */}
                              <td className="border border-gray-300 p-2">${employee?.salary ?? 0}</td>
                              <td className="border border-gray-300 p-2">{employee?.email ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">{employee?.phone ?? 'N/A'}</td>
                              <td className="border border-gray-300 p-2">
                                <button onClick={() => handleEditStaff(employee)} className="text-blue-500 mr-2">Edit</button>
                                <button onClick={() => handleDeleteStaff(employee.id)} className="text-red-500">Delete</button>
                              </td>
                            </tr>
                          ))
                       }
                        {/* ---- END: Added Check ---- */}
                      </tbody>
                    </table>
                  </div>
          </div>
          <div className="w-full lg:w-1/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
            <h2 className="text-lg font-semibold mb-4">
              {editingStaffId ? 'Update Employee' : 'Add Employee'}
            </h2>
            <div className="flex flex-col gap-2">
              <input type="text" name="firstName" value={staffFormData.firstName} onChange={handleStaffChange} placeholder="First Name" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="text" name="lastName" value={staffFormData.lastName} onChange={handleStaffChange} placeholder="Last Name" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="date" name="joinDate" value={staffFormData.joinDate} onChange={handleStaffChange} className="p-2 border rounded text-[#2F2F2F]" />
              <input type="text" name="role" value={staffFormData.role} onChange={handleStaffChange} placeholder="Role" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="text" name="bankAccountNo" value={staffFormData.bankAccountNo} onChange={handleStaffChange} placeholder="Bank Account No." className="p-2 border rounded text-[#2F2F2F]" />
              <input type="text" name="bankName" value={staffFormData.bankName} onChange={handleStaffChange} placeholder="Bank Name" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="text" name="bankIfsc" value={staffFormData.bankIfsc} onChange={handleStaffChange} placeholder="Bank IFSC" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="number" name="salary" value={staffFormData.salary} onChange={handleStaffChange} placeholder="Salary" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="email" name="email" value={staffFormData.email} onChange={handleStaffChange} placeholder="Email" className="p-2 border rounded text-[#2F2F2F]" />
              <input type="tel" name="phone" value={staffFormData.phone} onChange={handleStaffChange} placeholder="Phone" className="p-2 border rounded text-[#2F2F2F]" />
              {editingStaffId ? (
                    <>
                      <button 
                        onClick={() => handleUpdateStaff(editingStaffId)}
                         className="mt-2 p-2 bg-blue-500 text-white rounded"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          setEditingStaffId(false); 
                          handleCancelEditStaff();
                        }} 
                        className="mt-2 p-2 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>

                    </>
                  ) : (
                    <button 
                      onClick={handleAddStaff} className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  )}
              
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeesStaff;