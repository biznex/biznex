// src/app/dashboard/finance/transactions/page.jsx

"use client";

import React, { useState , useEffect ,useRef } from 'react';
import DashboardLayout from '../../components/dashboardlayout';
import axios from 'axios';
import { useRouter } from 'next/router';


const FinanceTransactionsPage = () => {
  const [manualTransactions, setManualTransactions] = useState([]);

  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'income', // Set a default value
});

 
  const [editingId, setEditingId] = useState(null);

  const [bills, setBills] = useState([]);

  const [onlineBills, setOnlineBills] = useState([]);

  const [selectedBill, setSelectedBill] = useState(null);
  const popupRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async () => {
    try {
        if (editingId) {
            setManualTransactions(manualTransactions.map((item) =>
                item.id === editingId ? { ...item, ...formData } : item
            ));
            setEditingId(null);
        } else {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                'https://biznex.onrender.com/finance/add-man-transaction',
                {
                    
                    type: formData.type,
                    description: formData.description,
                    amount: parseFloat(formData.amount),
                    date: new Date(formData.date).toISOString(),
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
                console.log('Transaction added successfully', data);
                alert('Transaction added successfully');
                window.location.reload();
            } else {
                console.error('Failed to add transaction:', response.statusText);
            }
        }

        setFormData({
          date: '',
          description: '',
          amount: '',
          type: 'income'
         });
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
};

{/* Fetching data for summary_all */}
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://biznex.onrender.com/finance/manual-transactions", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });

            console.log("Manual Transactions:", response.data);
            

            if (response.status >= 200 && response.status < 300) {
              const formData = response.data.map((item) => ({
                id: item.id,
                date: item.date,
                description: item.description,
                amount: parseFloat(item.amount),
                type: item.type,
              }));
            
              
            
              setManualTransactions(formData);
            }
            console.log(manualTransactions);
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

  const handleDeleteTransaction = async (id , type) => {
    if (!id) return alert('ID not provided');

    const confirm = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirm) return;

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'https://biznex.onrender.com/finance/delete-man-transaction',
            { id: id 
                , type: type },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,

            },
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
            setManualTransactions((prev) => prev.filter((item) => item.id !== id));
            alert('Transaction deleted successfully');
        } else if (response.status === 404) {
            alert('Transaction not found.');
        } else if (response.status >= 500) {
            alert('Server error. Please try again later.');
        } else {
            alert('Failed to delete transaction.');
        }

    } catch (err) {
        console.error('Delete Transaction Error:', err);
        if (err.response) {
            console.error('API Error Response:', err.response);
            alert(err.response.data.error || `Failed to delete transaction. Status: ${err.response.status}`);
        } else {
            alert('Failed to delete transaction. Please try again.');
        }
    }
};

const handleEditTransaction = (transaction) => {
  setEditingId(transaction.id);
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle null or undefined dates
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
  setFormData({
      date:formatDate(transaction.date), // Format date for input field,
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
  });
};

const handleUpdateTransaction = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `https://biznex.onrender.com/finance/update-man-transaction`,
            {
                id: id,
                type: formData.type,
                description: formData.description,
                amount: parseFloat(formData.amount),
                date: new Date(formData.date).toISOString(),
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
            console.log('Transaction updated successfully', data);
            setManualTransactions(manualTransactions.map((item) =>
                item.id === id ? { ...item, ...formData } : item
            ));
            setEditingId(null);
            setFormData({
                date: '',
                description: '',
                amount: '',
                type: 'income',
            });
            
        } else {
            console.error('Failed to update transaction:', response.statusText);
            alert('Failed to update transaction');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        alert('Error updating transaction');
    }
};

const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ date: '', description: '', amount: '', type: 'Income' });
  }

const handleViewBill = (bill) => {
  setSelectedBill(bill);
};

const closeBillPopup = () => {
  setSelectedBill(null);
};
 
{/*Bills summary */}
useEffect(() => {
  const fetchData = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://biznex.onrender.com/finance/bills', {
              headers: {
                  Authorization: `Bearer ${token}`
              },
              withCredentials: true,
          });

          console.log("Bills:", response.data);

          if (response.status >= 200 && response.status < 300) {
              const mappedBills = response.data.map(item => {
                  const bill = {
                      billId: item.bill_id,
                      date: item.generated_at,
                      totalAmount: item.total_amount,
                      paymentStatus: item.payment_status,
                      paymentMethod: item.payment_method,
                      products: item.products.map(product => ({
                          name: product.name,
                          unitPrice: product.price,
                          quantity: product.quantity,
                      })),
                  };
                  return bill;
              });

              setBills(mappedBills);
          }
          console.log(bills);
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

{/*onlinebills summary*/}
useEffect(() => {
  const fetchData = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://biznex.onrender.com/finance/web-bills', {
              headers: {
                  Authorization: `Bearer ${token}`
              },
              withCredentials: true,
          });

          console.log("Online Bills:", response.data);

          if (response.status >= 200 && response.status < 300) {
            const mappedBills = response.data.map(item => {
              const bill = {
                  billId: item.web_bill_id,
                  date: item.generated_at,
                  totalAmount: item.total_amount,
                  paymentStatus: item.payment_status,
                  paymentMethod: item.payment_method,
                  products: item.products?.map(product => ({ // Optional chaining here
                      name: product.name,
                      unitPrice: product.price,
                      quantity: product.quantity,
                  })) || [], // Provide an empty array as a default
              };
              return bill;
          });

              setOnlineBills(mappedBills);
          }
          console.log(onlineBills);
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

 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeBillPopup();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeBillPopup();
      }
    };

    if (selectedBill) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBill]);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Finance Transactions</h1>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Manual Transactions (3/4) */}
          <div className="w-full lg:w-3/4 bg-white border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Manual Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">Amount</th>
                    <th className="border border-gray-300 p-2">Type</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {manualTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="border border-gray-300 p-2">{formatDate(transaction.date)}</td>
                      <td className="border border-gray-300 p-2">{transaction.description}</td>
                      <td className="border border-gray-300 p-2">${parseFloat(transaction.amount).toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">{transaction.type}</td>
                      <td className="border border-gray-300 p-2">
                        <button onClick={() => handleEditTransaction(transaction)} className="text-blue-500 mr-2">Edit</button>
                        <button onClick={() => handleDeleteTransaction(transaction.id , transaction.type)} className="text-red-500">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Update Transaction Form (1/4) */}
          <div className="w-full lg:w-1/4 bg-white border border-gray-300 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </h2>
            <div className="flex flex-col gap-2">
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="border border-gray-300 p-2 rounded" />
              <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="border border-gray-300 p-2 rounded" placeholder="Description" />
              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="border border-gray-300 p-2 rounded" placeholder="Amount" />
              <select name="type" value={formData.type} onChange={handleInputChange} className="border border-gray-300 p-2 rounded">
              <option value="" >Type of entry</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              {editingId ? (
                    <>
                      <button 
                        onClick={() => handleUpdateTransaction(editingId)}
                         className="mt-2 p-2 bg-blue-500 text-white rounded"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          setEditingId(false); 
                          handleCancelEdit();
                        }} 
                        className="mt-2 p-2 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleAddTransaction} className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  )}
            </div>
          </div>
        </div>

        {/* Bills Table (Full Width) */}
        <div className="w-full bg-white border border-gray-300 rounded-lg p-4 mt-4">
                    <h2 className="text-lg font-semibold mb-4">Bills</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">Bill ID</th>
                                    <th className="border border-gray-300 p-2">Date</th>
                                    <th className="border border-gray-300 p-2">Total Amount</th>
                                    <th className="border border-gray-300 p-2">Payment Status</th>
                                    <th className="border border-gray-300 p-2">Payment Method</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((bill) => (
                                    <tr key={bill.billId}>
                                        <td className="border border-gray-300 p-2">{bill.billId}</td>
                                        <td className="border border-gray-300 p-2">{formatDate(bill.date)}</td>
                                        <td className="border border-gray-300 p-2">${parseFloat(bill.totalAmount).toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2">{bill.paymentStatus}</td>
                                        <td className="border border-gray-300 p-2">{bill.paymentMethod}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button onClick={() => handleViewBill(bill)} className="text-blue-500">View Bill</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

        {/* Online Bills Table (Full Width) */}
        <div className="w-full bg-white border border-gray-300 rounded-lg p-4 mt-4">
          <h2 className="text-lg font-semibold mb-4">Online Bills</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Bill ID</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Total Amount</th>
                  <th className="border border-gray-300 p-2">Payment Status</th>
                  <th className="border border-gray-300 p-2">Payment Method</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {onlineBills.map((webbill) => (
                  <tr key={webbill.billId}>
                    <td className="border border-gray-300 p-2">{webbill.billId}</td>
                    <td className="border border-gray-300 p-2">{formatDate(webbill.date)}</td>
                    <td className="border border-gray-300 p-2">${parseFloat(webbill.totalAmount).toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">{webbill.paymentStatus}</td>
                    <td className="border border-gray-300 p-2">{webbill.paymentMethod}</td>
                    <td className="border border-gray-300 p-2">
                      <button onClick={() => handleViewBill(webbill)} className="text-blue-500">View Bill</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bill Popup */}
      {selectedBill && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div ref={popupRef} className="bg-white p-8 rounded-md w-96 shadow-lg border border-black">
            <h2 className="text-xl font-semibold mb-4">Bill #{selectedBill.billId}</h2>
            <p className="text-gray-600 mb-2">Date: {formatDate(selectedBill.date)}</p>
            <h3 className="font-semibold mt-4 mb-2">Products:</h3>
            <ul className="space-y-2">
              {selectedBill.products.map((product, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">{product.name}</span>
                  <span className="text-gray-700">
                    ${parseFloat(product.unitPrice).toFixed(2)} x {product.quantity} = ${
                      (product.unitPrice * product.quantity).toFixed(2)
                    }
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-semibold mt-4 text-lg">Total Amount: ${parseFloat(selectedBill.totalAmount).toFixed(2)}</p>
            <button
              onClick={closeBillPopup}
              className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FinanceTransactionsPage;