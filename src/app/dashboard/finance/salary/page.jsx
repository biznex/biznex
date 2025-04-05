"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from '../../components/dashboardlayout';

const FinanceSalary = () => {
    const [salaries, setSalaries] = useState([
        { id: 1, employeeName: 'John Doe', salary: 3000, paymentDate: '2025-03-24', paymentMethod: 'Bank Transfer' },
        { id: 2, employeeName: 'Jane Smith', salary: 3500, paymentDate: '2025-03-25', paymentMethod: 'Credit Card' },
        { id: 3, employeeName: 'Antony Thomas', salary: 2800, paymentDate: '2025-03-26', paymentMethod: 'Cash' },
    ]);

    const [salaryFormData, setSalaryFormData] = useState({
        employeeName: '',
        salary: '',
        paymentDate: '',
        paymentMethod: 'Payment Method',
    });

    const [editingSalaryId, setEditingSalaryId] = useState(null);
    const [employeeSuggestionsAdd, setEmployeeSuggestionsAdd] = useState([]);
    const [salarySuggestionsAdd, setSalarySuggestionsAdd] = useState([]);
    const employeeInputRefAdd = useRef(null);
    const salaryInputRefAdd = useRef(null);

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setSalaryFormData({ ...salaryFormData, [name]: value });

        if (name === 'employeeName') {
            const suggestions = salaries
                .map((salary) => salary.employeeName)
                .filter((employee) => employee.toLowerCase().includes(value.toLowerCase()));
            setEmployeeSuggestionsAdd(suggestions);
        } else if (name === 'salary') {
            const suggestions = salaries
                .map((salary) => salary.salary.toString())
                .filter((salaryStr) => salaryStr.includes(value));
            setSalarySuggestionsAdd(suggestions);
        }
    };

    const handleAddSalary = () => {
        if (editingSalaryId) {
            setSalaries(salaries.map((salary) =>
                salary.id === editingSalaryId ? { ...salary, ...salaryFormData } : salary
            ));
            setEditingSalaryId(null);
        } else {
            setSalaries([...salaries, { id: Date.now(), ...salaryFormData }]);
        }
        setSalaryFormData({ employeeName: '', salary: '', paymentDate: '', paymentMethod: 'Payment Method' });
        setEmployeeSuggestionsAdd([]);
        setSalarySuggestionsAdd([]);
    };

    const handleDeleteSalary = (id) => {
        setSalaries(salaries.filter((salary) => salary.id !== id));
        if (editingSalaryId === id) {
            setEditingSalaryId(null);
            setSalaryFormData({ employeeName: '', salary: '', paymentDate: '', paymentMethod: 'Payment Method' });
        }
    };

    const handleEditSalary = (salary) => {
        setEditingSalaryId(salary.id);
        setSalaryFormData({
            employeeName: salary.employeeName,
            salary: salary.salary.toString(),
            paymentDate: salary.paymentDate,
            paymentMethod: salary.paymentMethod,
        });
    };

    const [paySalaryEmployee, setPaySalaryEmployee] = useState('');
    const [paySalaryAmount, setPaySalaryAmount] = useState('');
    const [paySalaryMethod, setPaySalaryMethod] = useState('Bank Transfer');
    const [employeeSuggestions, setEmployeeSuggestions] = useState([]);

    const employees = [...new Set(salaries.map((salary) => salary.employeeName))];

    const handlePaySalaryEmployeeChange = (e) => {
        const value = e.target.value;
        setPaySalaryEmployee(value);
        const suggestions = employees.filter((employee) =>
            employee.toLowerCase().includes(value.toLowerCase())
        );
        setEmployeeSuggestions(suggestions);

        const selectedEmployeeSalary = salaries.find(
            (salary) => salary.employeeName === value
        );

        if (selectedEmployeeSalary) {
            setPaySalaryAmount(selectedEmployeeSalary.salary);
            setPaySalaryMethod(selectedEmployeeSalary.paymentMethod);
        } else {
            setPaySalaryAmount('');
            setPaySalaryMethod('Bank Transfer');
        }
    };

    const handlePayNow = () => {
        console.log(`Paying ${paySalaryAmount} to ${paySalaryEmployee} via ${paySalaryMethod}`);
        setPaySalaryEmployee('');
        setPaySalaryAmount('');
        setEmployeeSuggestions([]);
    };

    const handleEmployeeSuggestionClickAdd = (employee) => {
        const selectedSalary = salaries.find(salary => salary.employeeName === employee)?.salary || '';
        setSalaryFormData({ ...salaryFormData, employeeName: employee, salary: selectedSalary.toString(), paymentDate: salaryFormData.paymentDate, paymentMethod: salaryFormData.paymentMethod });
        setEmployeeSuggestionsAdd([]);
    };

    const handleSalarySuggestionClickAdd = (salary) => {
        setSalaryFormData({ ...salaryFormData, employeeName: salaryFormData.employeeName, salary: salary, paymentDate: salaryFormData.paymentDate, paymentMethod: salaryFormData.paymentMethod });
        setSalarySuggestionsAdd([]);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (employeeInputRefAdd.current && !employeeInputRefAdd.current.contains(event.target)) {
                setEmployeeSuggestionsAdd([]);
            }
            if (salaryInputRefAdd.current && !salaryInputRefAdd.current.contains(event.target)) {
                setSalarySuggestionsAdd([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [employeeInputRefAdd, salaryInputRefAdd]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setEmployeeSuggestionsAdd([]);
                setSalarySuggestionsAdd([]);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <DashboardLayout>
            <div className="p-4 text-[#2F2F2F]">
                <h1 className="text-lg font-semibold mb-4">Salaries</h1>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="w-full lg:w-3/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">Salary Payments</h2>
                        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2">Sl. No</th>
                                        <th className="border border-gray-300 p-2">Employee Name</th>
                                        <th className="border border-gray-300 p-2">Salary</th>
                                        <th className="border border-gray-300 p-2">Payment Date</th>
                                        <th className="border border-gray-300 p-2">Payment Method</th>
                                        <th className="border border-gray-300 p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaries.map((salary) => (
                                        <tr key={salary.id}>
                                            <td className="border border-gray-300 p-2">{salary.id}</td>
                                            <td className="border border-gray-300 p-2">{salary.employeeName}</td>
                                            <td className="border border-gray-300 p-2">${salary.salary.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-2">{salary.paymentDate}</td>
                                            <td className="border border-gray-300 p-2">{salary.paymentMethod}</td>
                                            <td className="border border-gray-300 p-2">
                                                <button onClick={() => handleEditSalary(salary)} className="text-blue-500 mr-2">Edit</button>
                                                <button onClick={() => handleDeleteSalary(salary.id)} className="text-red-500">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/4 p-4 border border-[#2F2F2F] rounded-xl flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingSalaryId ? 'Update Salary' : 'Add Salary'}
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div className="relative" ref={employeeInputRefAdd}>
                                <input type="text" name="employeeName" value={salaryFormData.employeeName} onChange={handleSalaryChange} placeholder="Employee Name" className="p-2 border rounded text-[#2F2F2F] w-full" />
                                {employeeSuggestionsAdd.length > 0 && (
                                    <ul className="absolute top-full left-0 w-full border rounded mt-1 bg-white z-10">
                                        {employeeSuggestionsAdd.map((employee) => (
                                            <li key={employee} onClick={() => handleEmployeeSuggestionClickAdd(employee)} className="p-2 hover:bg-gray-100 cursor-pointer">
                                                {employee}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative" ref={salaryInputRefAdd}>
                                <input type="number" name="salary" value={salaryFormData.salary} onChange={handleSalaryChange} placeholder="Salary" className="p-2 border rounded text-[#2F2F2F] w-full" />
                                {salarySuggestionsAdd.length > 0 && (
                                    <ul className="absolute top-full left-0 w-full border rounded mt-1 bg-white z-10">
                                        {salarySuggestionsAdd.map((salary) => (
                                            <li key={salary} onClick={() => handleSalarySuggestionClickAdd(salary)} className="p-2 hover:bg-gray-100 cursor-pointer">
                                                {salary}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <input type="date" name="paymentDate" value={salaryFormData.paymentDate} onChange={handleSalaryChange} className="p-2 border rounded text-[#2F2F2F]" />
                            <select name="paymentMethod" value={salaryFormData.paymentMethod} onChange={handleSalaryChange} className="p-2 border rounded text-[#2F2F2F]">
                                <option>Payment Method</option>
                                <option>Bank Transfer</option>
                                <option>Credit Card</option>
                                <option>Cash</option>
                            </select>
                            <button onClick={handleAddSalary} className="mt-2 p-2 bg-blue-500 text-white rounded">
                                {editingSalaryId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-4 p-4 border border-[#2F2F2F] rounded-xl">
                    <h2 className="text-lg font-semibold mb-4">Pay Salaries</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={paySalaryEmployee}
                                onChange={handlePaySalaryEmployeeChange}
                                placeholder="Select Employee"
                                className="p-2 border rounded w-full text-[#2F2F2F]"
                            />
                            {employeeSuggestions.length > 0 && (
                                <ul className="border rounded mt-1 bg-white">
                                    {employeeSuggestions.map((employee) => (
                                        <li
                                            key={employee}
                                            onClick={() => {
                                                setPaySalaryEmployee(employee);
                                                setEmployeeSuggestions([]);
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {employee}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex-grow">
                            <input
                                type="number"
                                value={paySalaryAmount}
                                placeholder="Salary"
                                className="p-2 border rounded w-full text-[#2F2F2F]"
                                disabled
                            />
                        </div>
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={paySalaryMethod}
                                placeholder="Payment Method"
                                className="p-2 border rounded w-full text-[#2F2F2F]"
                                disabled
                            />
                        </div>
                        <button
                            onClick={handlePayNow}
                            className="mt-2 md:mt-0 p-2 bg-green-500 text-white rounded"
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FinanceSalary;