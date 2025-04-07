// src/app/dashboard/finance/transactions/page.jsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/dashboardlayout';

const FinanceTransactionsPage = () => {
  const [manualTransactions, setManualTransactions] = useState([
    { id: 1, date: '2023-10-26', description: 'Payment from Client XYZ', amount: 500, type: 'Income' },
    { id: 2, date: '2023-10-25', description: 'Office Supplies', amount: 100, type: 'Expense' },
    { id: 3, date: '2023-10-24', description: 'Salary Payment', amount: 2000, type: 'Expense' },
  ]);

  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'Income',
  });

  const [editingId, setEditingId] = useState(null);

  const [bills, setBills] = useState([
    {
      billId: 101,
      date: '2023-10-27',
      totalAmount: 350,
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      products: [
        { name: 'Product A', unitPrice: 100, quantity: 2 },
        { name: 'Product B', unitPrice: 150, quantity: 1 },
      ],
    },
    {
      billId: 102,
      date: '2023-10-28',
      totalAmount: 200,
      paymentStatus: 'Pending',
      paymentMethod: 'Cheque',
      products: [
        { name: 'Product C', unitPrice: 200, quantity: 1 },
      ],
    },
  ]);

  const [onlineBills, setOnlineBills] = useState([
    {
      billId: 201,
      date: '2023-10-29',
      totalAmount: 120,
      paymentStatus: 'Paid',
      paymentMethod: 'Online Transfer',
      products: [
        { name: 'Service X', unitPrice: 60, quantity: 2 },
      ],
    },
    {
      billId: 202,
      date: '2023-10-30',
      totalAmount: 80,
      paymentStatus: 'Pending',
      paymentMethod: 'Online Payment',
      products: [
        { name: 'Subscription Y', unitPrice: 80, quantity: 1 },
      ],
    },
  ]);

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

  const handleAddTransaction = () => {
    if (editingId) {
      setManualTransactions(manualTransactions.map((transaction) =>
        transaction.id === editingId ? { ...transaction, ...formData } : transaction
      ));
      setEditingId(null);
    } else {
      setManualTransactions([
        ...manualTransactions,
        { id: Date.now(), ...formData },
      ]);
    }
    setFormData({ date: '', description: '', amount: '', type: 'Income' });
  };

  const handleDeleteTransaction = (id) => {
    setManualTransactions(manualTransactions.filter((transaction) => transaction.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormData({ date: '', description: '', amount: '', type: 'Income' });
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
    });
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
  };

  const closeBillPopup = () => {
    setSelectedBill(null);
  };

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
                      <td className="border border-gray-300 p-2">${transaction.amount.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">{transaction.type}</td>
                      <td className="border border-gray-300 p-2">
                        <button onClick={() => handleEditTransaction(transaction)} className="text-blue-500 mr-2">Edit</button>
                        <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-500">Delete</button>
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
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <button onClick={handleAddTransaction} className="bg-blue-500 text-white p-2 rounded">
                {editingId ? 'Update' : 'Add'}
              </button>
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
                    <td className="border border-gray-300 p-2">${bill.totalAmount.toFixed(2)}</td>
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
                {onlineBills.map((bill) => (
                  <tr key={bill.billId}>
                    <td className="border border-gray-300 p-2">{bill.billId}</td>
                    <td className="border border-gray-300 p-2">{formatDate(bill.date)}</td>
                    <td className="border border-gray-300 p-2">${bill.totalAmount.toFixed(2)}</td>
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
                    ${product.unitPrice.toFixed(2)} x {product.quantity} = ${
                      (product.unitPrice * product.quantity).toFixed(2)
                    }
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-semibold mt-4 text-lg">Total Amount: ${selectedBill.totalAmount.toFixed(2)}</p>
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