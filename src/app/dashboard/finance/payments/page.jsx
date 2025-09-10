// src/app/dashboard/finance/payments/page.jsx

"use client";

import React, { useState , useEffect } from "react";
import DashboardLayout from '../../components/dashboardlayout';
import axios from "axios";


const FinancePayments = () => {
  const [accountsPayable, setAccountsPayable] = useState([]);

  const [accountsReceivable, setAccountsReceivable] = useState([]);

  const [onDeleteSuccess, setOnDeleteSuccess] = useState(false);
  
  const [payableFormData, setPayableFormData] = useState({
    accountName: '',
    amount: '',
    date: '',
    paymentMethod: 'Payment Method',
    status: 'Payment Status',
  });

  const [receivableFormData, setReceivableFormData] = useState({
    accountName: '',
    amount: '',
    dueDate: '',
    paymentMethod: 'Payment Method',
    status: 'Payment Status',
  });

  const [editingPayableId, setEditingPayableId] = useState(null);
  const [editingReceivableId, setEditingReceivableId] = useState(null);

  const handlePayableChange = (e) => {
    setPayableFormData({ ...payableFormData, [e.target.name]: e.target.value });
  };

  const handleReceivableChange = (e) => {
    setReceivableFormData({ ...receivableFormData, [e.target.name]: e.target.value });
  };

  const handleAddPayable = async () => {
    try {
        if (editingPayableId) {
            setAccountsPayable(accountsPayable.map((item) =>
                item.id === editingPayableId ? { ...item, ...payableFormData } : item
            ));
            setEditingPayableId(null);
        } else {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                'https://biznex.onrender.com/finance/add-pay-acc',
                {
                    
                    account_name: payableFormData.accountName,
                    amount: parseFloat(payableFormData.amount),
                    payment_date: payableFormData.date,
                    payment_method: payableFormData.paymentMethod,
                    status: payableFormData.status,
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
                console.log('Payable added successfully', data);
                alert('Payable added successfully');
                window.location.reload();
            } else {
                console.error('Failed to add payable:', response.statusText);
            }
        }

        setPayableFormData({ accountName: '', amount: '', date: '', paymentMethod: 'Payment Method', status: 'Payment Status' });
    } catch (error) {
        console.error('Error adding payable:', error);
    }
};

const handleUpdatePayable = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
        'https://biznex.onrender.com/finance/update-pay-acc',
        {
            id: id,
            account_name: payableFormData.accountName,
            amount: parseFloat(payableFormData.amount),
            payment_date: payableFormData.date,
            payment_method: payableFormData.paymentMethod,
            status: payableFormData.status,
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
          console.log('Payable updated successfully', data);
          setAccountsPayable(accountsPayable.map((item) =>
              item.id === id ? { ...item, ...payableFormData } : item
          ));
          setEditingPayableId(null);
          setPayableFormData({ accountName: '', amount: '', date: '', paymentMethod: 'Payment Method', status: 'Payment Status' });
      } else {
          console.error('Failed to update payable:', response.statusText);
      }
  } catch (error) {
      console.error('Error updating payable:', error);
  }
};

  const handleAddReceivable = async () => {
    try {
      if (editingReceivableId) {
        setAccountsReceivable(accountsReceivable.map((item) =>
          item.id === editingReceivableId ? { ...item, ...receivableFormData } : item
        ));
        setEditingReceivableId(null);
      } else {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            'https://biznex.onrender.com/finance/add-recv-acc',
            {
                
                account_name: receivableFormData.accountName,
                amount: parseFloat(receivableFormData.amount),
                due_date: receivableFormData.dueDate,
                payment_method: receivableFormData.paymentMethod,
                status: receivableFormData.status,
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
                console.log('Recievable added successfully', data);
                alert('Receivable added successfully');
                window.location.reload();
            } else {
                console.error('Failed to add payable:', response.statusText);
            }
      }
      setReceivableFormData({ accountName: '', amount: '', dueDate: '', paymentMethod: 'Payment Method', status: 'Payment Status' });
    } catch (error) {
      console.error('Error adding receivable:', error);
      // Handle network errors or other exceptions
    }
  };

  const handleUpdateReceivable = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://biznex.onrender.com/finance/update-recv-acc`,
        {
          id: id,
          account_name: receivableFormData.accountName,
          amount: parseFloat(receivableFormData.amount),
          due_date: receivableFormData.dueDate,
          payment_method: receivableFormData.paymentMethod,
          status: receivableFormData.status,
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
      if (response.status >= 200 && response.status < 300) { // Check for successful status codes
        console.log('Receivable updated successfully', data);
        setAccountsReceivable(accountsReceivable.map((item) =>
          item.id === id ? { ...item, ...receivableFormData } : item
        ));
        setEditingReceivableId(null);
        setReceivableFormData({ accountName: '', amount: '', dueDate: '', paymentMethod: 'Payment Method', status: 'Payment Status' });
      } else {
        console.error('Failed to update receivable:', response.statusText); 
      }
    } catch (error) {
      console.error('Error updating receivable:', error);   
      // Handle network errors or other exceptions
    }
  };

   {/* Fetching data for summary_all */}
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://biznex.onrender.com/finance/accounts", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("API Response:", response.data);
            

            if (response.status >= 200 && response.status < 300) {
              const payableData = response.data.payable.map((item) => ({
                id: item.id,
                accountName: item.account_name,
                amount: parseFloat(item.amount),
                date: item.payment_date,
                paymentMethod: item.payment_method,
                status: item.status,
              }));
            
              const receivableData = response.data.receivable.map((item) => ({
                id: item.id,
                accountName: item.account_name,
                amount: parseFloat(item.amount),
                dueDate: item.due_date,
                paymentMethod: item.payment_method,
                status: item.status,
              }));
            
              setAccountsPayable(payableData);
              setAccountsReceivable(receivableData);
            }
            console.log(accountsPayable);
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

    fetchData();
}, []);


const handleDeletePayable = async (id) => {
    if (!id) return alert('ID not provided');

    const confirm = window.confirm('Are you sure you want to delete this account?');
    if (!confirm) return;

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'https://biznex.onrender.com/finance/delete-pay-acc',
            { id: id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Add this if needed
            }
        );

        console.log('API Response:', response.data); // Log response data

        if (response.status >= 200 && response.status < 300) {
            setAccountsPayable((prev) => prev.filter((item) => item.id !== id));
            alert('Account deleted successfully');
        } else if (response.status === 404) {
            alert('Account not found.');
        } else if (response.status >= 500) {
            alert('Server error. Please try again later.');
        } else {
            alert('Failed to delete account.');
        }

    } catch (err) {
        console.error('Delete Payable Error:', err);
        if (err.response) {
            console.error('API Error Response:', err.response);
            alert(err.response.data.error || `Failed to delete account. Status: ${err.response.status}`);
        } else {
            alert('Failed to delete account. Please try again.');
        }
    }
};

const handleDeleteReceivable = async (id) => {
  if (!id) return alert('ID not provided');

  const confirm = window.confirm('Are you sure you want to delete this account?');
  if (!confirm) return;

  try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
          'https://biznex.onrender.com/finance/delete-recv-acc',
          { id: id },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              withCredentials: true, // Add this if needed
          }
      );

      console.log('API Response:', response.data); // Log response data

      if (response.status >= 200 && response.status < 300) {
          setAccountsReceivable((prev) => prev.filter((item) => item.id !== id));
          alert('Account deleted successfully');
      } else if (response.status === 404) {
          alert('Account not found.');
      } else if (response.status >= 500) {
          alert('Server error. Please try again later.');
      } else {
          alert('Failed to delete account.');
      }

  } catch (err) {
      console.error('Delete Payable Error:', err);
      if (err.response) {
          console.error('API Error Response:', err.response);
          alert(err.response.data.error || `Failed to delete account. Status: ${err.response.status}`);
      } else {
          alert('Failed to delete account. Please try again.');
      }
  }
};

  
  const handleEditPayable = (item) => {
    setEditingPayableId(item.id);
    const formatDate = (dateString) => {
      if (!dateString) return ''; // Handle null or undefined dates
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };
    setPayableFormData({
      accountName: item.accountName,
      amount: item.amount.toString(),
      date: formatDate(item.date), // Format date to YYYY-MM-DD
      paymentMethod: item.paymentMethod,
      status: item.status,
    });
  };

  const handleCancelEditPayable = () => {
    setEditingPayableId(null);
    setPayableFormData({
      accountName: '',
      amount: '',
      date: '', //changed back to date, to match the form data
      paymentMethod: 'Payment Method',
      status: 'Payment Status',
    });
  };
  

  const handleEditReceivable = (item) => {
    setEditingReceivableId(item.id);

    // Function to convert date to YYYY-MM-DD format
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle null or undefined dates
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    setReceivableFormData({
        accountName: item.accountName,
        amount: item.amount.toString(),
        dueDate: formatDate(item.dueDate), // Convert the date
        paymentMethod: item.paymentMethod,
        status: item.status,
    });
};

  const handleCancelEditReceivable = () => {
    setEditingReceivableId(null);
    setReceivableFormData({
      accountName: '',
      amount: '',
      dueDate: '',
      paymentMethod: 'Payment Method',
      status: 'Payment Status',
    });
  };
  

  return (
    <DashboardLayout>
      <div className="bg-opacity-0 p-4 text-[#2F2F2F]">
        <h1 className="text-lg font-semibold mb-4">Payments</h1>
        <div className="flex flex-col gap-4 w-full">
          {/* Accounts Payable Section */}
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="w-full lg:w-3/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Accounts Payable</h2>
              <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Acc.ID</th>
                      <th className="border border-gray-300 p-2">Account Name</th>
                      <th className="border border-gray-300 p-2">Amount</th>
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Payment Method</th>
                      <th className="border border-gray-300 p-2">Status</th>
                      <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {accountsPayable.map((item) => {
                      if (item.amount === undefined) {
                        return null; // Skip rendering this row
                      }
 
                      return (
                        <tr key={item.id}>
                          <td className="border border-gray-300 p-2">{item.id}</td>
                          <td className="border border-gray-300 p-2">{item.accountName}</td>
                          <td className="border border-gray-300 p-2">₹{parseFloat(item.amount).toFixed(2)}</td>
                          <td className="border border-gray-300 p-2">{item.date}</td>
                          <td className="border border-gray-300 p-2">{item.paymentMethod}</td>
                          <td className="border border-gray-300 p-2">{item.status}</td>
                          <td className="border border-gray-300 p-2">
                            <button onClick={() => handleEditPayable(item)} className="text-blue-500 mr-2">Edit</button>
                            <button onClick={() => handleDeletePayable(item.id)} className="text-red-500">Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full lg:w-1/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
            <h2 className="text-lg font-semibold mb-4">
                {editingPayableId ? 'Update Accounts Payable' : 'Add to Accounts Payable'}
              </h2>
              <div className="flex flex-col gap-2">
                <input type="text" name="accountName" value={payableFormData.accountName} onChange={handlePayableChange} placeholder="Account Name" className="p-2 border rounded text-[#2F2F2F]" />
                <input type="number" name="amount" value={payableFormData.amount} onChange={handlePayableChange} placeholder="Amount" className="p-2 border rounded text-[#2F2F2F]" />
                <input type="date" name="date" value={payableFormData.date} onChange={handlePayableChange} className="p-2 border rounded text-[#2F2F2F]" />
                <select name="paymentMethod" value={payableFormData.paymentMethod} onChange={handlePayableChange} className="p-2 border rounded text-[#2F2F2F]">
                <option value="" disabled>Payment Method</option>
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>Cash</option>
                </select>
                <select name="status" value={payableFormData.status} onChange={handlePayableChange} className="p-2 border rounded text-[#2F2F2F]">
                <option value="" disabled>Payment Status</option>
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
                
                  {editingPayableId ? (
                    <>
                      <button 
                        onClick={() => handleUpdatePayable(editingPayableId)}
                         className="mt-2 p-2 bg-blue-500 text-white rounded"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          setEditingPayableId(false); 
                          handleCancelEditPayable();
                        }} 
                        className="mt-2 p-2 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleAddPayable} className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  )}
                

              </div>
            </div>
          </div>

          {/* Accounts Receivable Section */}
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="w-full lg:w-3/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Accounts Receivable</h2>
              <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Acc.ID</th>
                      <th className="border border-gray-300 p-2">Account Name</th>
                      <th className="border border-gray-300 p-2">Amount</th>
                      <th className="border border-gray-300 p-2">Due Date</th>
                      <th className="border border-gray-300 p-2">Payment Method</th>
                      <th className="border border-gray-300 p-2">Status</th>
                      <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {accountsReceivable.map((item) => {
                        if (item.amount === undefined) {
                            return null; // Skip rendering this row
                        }

                        return (
                            <tr key={item.id}>
                                <td className="border border-gray-300 p-2">{item.id}</td>
                                <td className="border border-gray-300 p-2">{item.accountName}</td>
                                <td className="border border-gray-300 p-2">₹{parseFloat(item.amount).toFixed(2)}</td>
                                <td className="border border-gray-300 p-2">{item.dueDate}</td>
                                <td className="border border-gray-300 p-2">{item.paymentMethod}</td>
                                <td className="border border-gray-300 p-2">{item.status}</td>
                                <td className="border border-gray-300 p-2">
                                    <button onClick={() => handleEditReceivable(item)} className="text-blue-500 mr-2">Edit</button>
                                    <button onClick={() => 
                                      handleDeleteReceivable(item.id)} className="text-red-500">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full lg:w-1/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
              <h2 className="text-lg font-semibold mb-4">
                {editingReceivableId ? 'Update Accounts Receivable' : 'Add to Accounts Receivable'}
              </h2>
              <div className="flex flex-col gap-2">
                <input type="text" name="accountName" value={receivableFormData.accountName} onChange={handleReceivableChange} placeholder="Account Name" className="p-2 border rounded text-[#2F2F2F]" />
                <input type="number" name="amount" value={receivableFormData.amount} onChange={handleReceivableChange} placeholder="Amount" className="p-2 border rounded text-[#2F2F2F]" />
                <input type="date" name="dueDate" value={receivableFormData.dueDate} onChange={handleReceivableChange} className="p-2 border rounded text-[#2F2F2F]" />
                <select name="paymentMethod" value={receivableFormData.paymentMethod} onChange={handleReceivableChange} className="p-2 border rounded text-[#2F2F2F]">
                <option value="" disabled >Payment Method</option>
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>Cash</option>
                </select>
                <select name="status" value={receivableFormData.status} onChange={handleReceivableChange} className="p-2 border rounded text-[#2F2F2F]">
                <option value="" disabled >Payment Status</option>
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
                {editingReceivableId ? (
                    <>
                      <button 
                        onClick={() => handleUpdateReceivable(editingReceivableId)}
                         className="mt-2 p-2 bg-blue-500 text-white rounded"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          setEditingReceivableId(false); 
                          handleCancelEditReceivable();
                        }} 
                        className="mt-2 p-2 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>

                    </>
                  ) : (
                    <button 
                      onClick={handleAddReceivable} className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancePayments;