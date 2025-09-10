// src/app/dashboard/finance/salary/page.jsx

"use client";

import React, { useState ,useEffect , useRef} from "react";
import DashboardLayout from '../../components/dashboardlayout';
import axios from "axios";
import { useRouter } from "next/navigation";  

const FinanceSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const router = useRouter(); // Initialize the router
  const [staff, setStaff] = useState([]);
  const [salaryFormData, setSalaryFormData] = useState({
    employeeName: '',
    amount: '',
    paymentDate: '',
    paymentMonth: '', // Added paymentMonth to the state
    paymentMethod: '',
    employeeId: ''
     // Default value
  });

  const [editingSalaryId, setEditingSalaryId] = useState(null);
  const [employeeSuggestionsAdd, setEmployeeSuggestionsAdd] = useState([]);
      const [salarySuggestionsAdd, setSalarySuggestionsAdd] = useState([]);
      const employeeInputRefAdd = useRef(null);
      const salaryInputRefAdd = useRef(null);
      let [emId, setEmId] = useState("");
  //const [salaryMonth, setSalaryMonth] = useState(''); // Default value for salary month
  

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryFormData({ ...salaryFormData, [name]: value });

    if (name === 'employeeName') {
        const suggestions = staff
            .map((employee) => `${employee.firstName} ${employee.lastName}`)
            .filter((employee) => employee.toLowerCase().includes(value.toLowerCase()));
        setEmployeeSuggestionsAdd(suggestions);
    }
};

  const handleAddSalary = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            'https://biznex.onrender.com/salary/add-salary',
            {
              employee_id: salaryFormData.employeeId,
                salary_amount: salaryFormData.amount,
                salary_month: salaryFormData.paymentMonth,
                payment_method: salaryFormData.paymentMethod,
                payment_date: salaryFormData.paymentDate,
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
            console.log('Salary added successfully', data);
            alert('Salary added successfully');
            window.location.reload();
        } else {
            console.error('Failed to add salary:', response.statusText);
        }

        setSalaryFormData({
          employeeName: '',
          amount: '',
          paymentDate: '',
          paymentMonth: '',
          paymentMethod: '',
          employeeId: '',
      });
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
};

{/* Fetching data for summary_all */}
useEffect(() => {
  const fetchSalaryData = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get("https://biznex.onrender.com/salary/salaries", {
              headers: {
                  Authorization: `Bearer ${token}`
              },
              withCredentials: true,
          });

          if (response.status >= 200 && response.status < 300) {
              const formData = response.data.salaries.map((item) => ({
                
                employeeName: item.employee_name,
                  amount: item.salary_amount,
                  paymentDate: item.payment_date,
                  paymentMethod: item.payment_method,
                  paymentMonth: item.salary_month,
              }));
              setSalaries(formData);
          }
      } catch (error) {
          console.error("Error fetching data:", error);
          if (error.response && error.response.status === 401) {
              alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
              router.push("/login");
          }
      }
  };

  fetchSalaryData();
}, [router]);
useEffect(() => {
  const fetchStaffData = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://biznex.onrender.com/employee/employees', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });

          if (response.status >= 200 && response.status < 300) {
              const staffData = response.data.employees.map((item) => ({
                  id: item.id,
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
      } catch (error) {
          console.error("Error fetching data:", error);
          if (error.response && error.response.status === 401) {
              alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
              router.push("/login");
          }
      }
  };
  fetchStaffData();
}, [router]);

  /*const handleDeleteSalary = (id) => {
    setSalaries(salaries.filter((salary) => salary.id !== id));
    if (editingSalaryId === id) {
      setEditingSalaryId(null);
      setSalaryFormData({ employeeName: '', amount: '', paymentDate: '', paymentMethod: 'Payment Method' }); // Reset to default
    }
  };*/

 /* const handleEditSalary = (salary) => {
    setEditingSalaryId(salary.id);
    const formatDate = (dateString) => {
      if (!dateString) return ''; // Handle null or undefined dates
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };
    setSalaryFormData({
      employeeName: salary.employeeName,
      amount: salary.amount.toString(),
      paymentDate: salary.paymentDate,
      paymentMonth: salary.paymentMonth,
      paymentMethod: salary.paymentMethod,
    });
  };*/

  /*const handleCancelEdit = () => {
    setEditingSalaryId(null);
    setSalaries({ date: '', description: '', amount: '', type: 'Income' });
  }

    const [paySalaryEmployee, setPaySalaryEmployee] = useState('');
    const [paySalaryAmount, setPaySalaryAmount] = useState('');
    const [paySalaryMethod, setPaySalaryMethod] = useState('Bank Transfer');
    const [employeeSuggestions, setEmployeeSuggestions] = useState([]);*/

    //const employees = [...new Set(salaries.map((salary) => salary.employeeName))];

    /*const handlePaySalaryEmployeeChange = (e) => {
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
    };*/

    const handleEmployeeSuggestionClickAdd = (employee) => {
      const selectedEmployee = staff.find(staffMember => `${staffMember.firstName} ${staffMember.lastName}` === employee);
      const selectedId = selectedEmployee?.id || '';

      const selectedSalary = selectedEmployee?.salary || '';
      setSalaryFormData({
          ...salaryFormData,
          employeeId: selectedId, // Store employeeId here
          employeeName: employee,
          amount: selectedSalary.toString(),
          paymentDate: salaryFormData.paymentDate,
          paymentMethod: salaryFormData.paymentMethod,
      });
      setEmployeeSuggestionsAdd([]);
  };

    /*const handleSalarySuggestionClickAdd = (salary) => {
        setSalaryFormData({ ...salaryFormData, employeeName: salaryFormData.employeeName, salary: salary, paymentDate: salaryFormData.paymentDate, paymentMethod: salaryFormData.paymentMethod });
        setSalarySuggestionsAdd([]);
    };*/
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
                                        <th className="border border-gray-300 p-2">Month of Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaries.map((salary, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2">{index+1}</td>
                                            <td className="border border-gray-300 p-2">{salary.employeeName}</td>
                                            <td className="border border-gray-300 p-2">${parseFloat(salary.amount).toFixed(2)}</td>
                                            <td className="border border-gray-300 p-2">{salary.paymentDate}</td>
                                            <td className="border border-gray-300 p-2">{salary.paymentMethod}</td>
                                            <td className="border border-gray-300 p-2">{salary.paymentMonth}</td>
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
                              <input
                                  type="text"
                                  name="employeeName"
                                  value={salaryFormData.employeeName}
                                  onChange={handleSalaryChange}
                                  placeholder="Employee Name"
                                  className="p-2 border rounded text-[#2F2F2F] w-full"
                              />
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
                              <input
                                  type="number"
                                  name="salary"
                                  value={salaryFormData.amount} // Use amount here
                                  placeholder="Salary"
                                  className="p-2 border rounded text-[#2F2F2F] w-full"
                                  readOnly // Make it read-only
                              />
                          </div>
                          <input
                              type="date"
                              name="paymentDate"
                              value={salaryFormData.paymentDate}
                              onChange={handleSalaryChange}
                              className="p-2 border rounded text-[#2F2F2F]"
                          />
                          <input
                            type="month"
                            name="paymentMonth"
                            value={salaryFormData.paymentMonth}
                            onChange={handleSalaryChange}
                            className="p-2 border rounded text-[#2F2F2F]"
                        />
                          <select
                              name="paymentMethod"
                              value={salaryFormData.paymentMethod}
                              onChange={handleSalaryChange}
                              className="p-2 border rounded text-[#2F2F2F]"
                          >
                              <option value="" disabled>Payment Method</option>
                              <option value="bank_transfer">Bank Transfer</option>
                              <option value="card">Card</option>
                              <option value="cash">Cash</option>
                              <option value="cheque">Cheque</option>
                              <option value="upi">UPI</option>
                          </select>
                          <button onClick={()=>handleAddSalary(salaryFormData.id)} className="mt-2 p-2 bg-blue-500 text-white rounded">
                              Add
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </DashboardLayout>
  );
  };

export default FinanceSalary;