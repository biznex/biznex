// src/app/dashboard/page.jsx

"use client";

import React, { useState , useEffect} from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/dashboardlayout';


import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Import arrow icons
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function FinanceOverviewPage() {
  const [profitDateRange, setProfitDateRange] = useState('week');
  const [totalProfitArray, setTotalProfitArray] = useState([]);
  const [totalExpensesArray, setTotalExpensesArray] = useState([]);
  const [totalIncomeArray, setTotalIncomeArray] = useState([]);
  const [labelArray, setLabelArray] = useState([]);

  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [changeIncome, setChangeIncome] = useState(null);
  const [changeExpenses, setChangeExpenses] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [changeProfit, setChangeProfit] = useState(null);
  const error = null;


{/* Fetching data for  chart */}
useEffect(() => {
  const fetchData = async () => {
      try {
          const token = localStorage.getItem("token"); // Get token
          console.log("Profit Date Range:", profitDateRange);
          const response = await axios.post(
              "https://biznex.onrender.com/dashboard/grouped/all",
              { groupBy: profitDateRange }, // Corrected request body
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                  },
              }
          );

          console.log(response.data);
           // Log the date range
           const tia = response.data.map((item) => parseFloat(item.total_income));
          setTotalIncomeArray(tia);
          const tpa = response.data.map((item) => parseFloat(item.total_profit));
          setTotalProfitArray(tpa);
          const tea = response.data.map((item) => parseFloat(item.total_expense));
          setTotalExpensesArray(tea);
          const lA = response.data.map((item) => item.label); // Assuming 'date' is the field in your response
          setLabelArray(lA);
      } catch (error) {
          console.error("Axios Error:", error.response ? error.response.data : error);
          if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
            
            router.push("/login");
        } else {
            // Handle other errors
            console.error("Error fetching data:", error);
            // Optionally, show an alert or notification to the user
        }
      }
  };

  fetchData(); // Call the function whenever profitDateRange changes
}, [profitDateRange]);
  
  const getChartData = () => {
    switch (profitDateRange) {
  
      case "week":
        return {
          labels: labelArray,
          datasets: [
            {
              label: "Income",
              data: totalIncomeArray,
              fill: false,
              backgroundColor: "blue",
              borderColor: "rgba(0, 0, 255, 0.5)",
            },
            {
              label: "Profit",
              data: totalProfitArray,
              fill: false,
              backgroundColor: "green",
              borderColor: "rgba(0, 255, 0, 0.5)",
            },
            {
              label: "Expenses",
              data: totalExpensesArray,
              fill: false,
              backgroundColor: "red",
              borderColor: "rgba(255, 0, 0, 0.5)",
            },
          ],
        };
  
      case "month":
        return {
          labels: labelArray,
          datasets: [
            {
              label: "Income",
              data: totalIncomeArray,
              fill: false,
              backgroundColor: "blue",
              borderColor: "rgba(0, 0, 255, 0.5)",
            },
            {
              label: "Profit",
              data: totalProfitArray,
              fill: false,
              backgroundColor: "green",
              borderColor: "rgba(0, 255, 0, 0.5)",
            },
            {
              label: "Expenses",
              data: totalExpensesArray,
              fill: false,
              backgroundColor: "red",
              borderColor: "rgba(255, 0, 0, 0.5)",
            },
          ],
        };
  
      case "year":
        return {
          labels: labelArray,
          datasets: [
            {
              label: "Income",
              data: totalIncomeArray,
              fill: false,
              backgroundColor: "blue",
              borderColor: "rgba(0, 0, 255, 0.5)",
            },
            {
              label: "Profit",
              data: totalProfitArray,
              fill: false,
              backgroundColor: "green",
              borderColor: "rgba(0, 255, 0, 0.5)",
            },
            {
              label: "Expenses",
              data: totalExpensesArray,
              fill: false,
              backgroundColor: "red",
              borderColor: "rgba(255, 0, 0, 0.5)",
            },
          ],
        };
  
      default:
        return {};
    }
  };

  // Chart options (set styles, tooltips, grid colors)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#2F2F2F",
        },
      },
      title: {
        display: true,
        text: "Profit/Expenses Over Time",
        color: "#2F2F2F",
      },
      tooltip: {
        titleColor: "#2F2F2F",
        bodyColor: "#2F2F2F",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#2F2F2F",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#2F2F2F",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const getOrdersData = (dateRange) => {
    const labels = {
      "24hours": ["1 AM", "4 AM", "7 AM", "10 AM", "1 PM", "4 PM", "7 PM", "10 PM"],
      "7days": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      "1month": Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      "1year": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    };
  
    const data = {
      "24hours": [5, 7, 6, 8, 10, 12, 9, 11],
      "7days": [5, 8, 6, 10, 12, 9, 15],
      "1month": Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10),
      "1year": [200, 220, 250, 280, 300, 320, 350, 370, 390, 400, 420, 12],
    };
  
    return {
      labels: labels[dateRange] || [],
      datasets: [
        {
          label: "Orders",
          data: data[dateRange] || [],
          fill: true,
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          borderColor: "rgba(0, 123, 255, 0.5)",
          pointBackgroundColor: "blue",
          tension: 0.4,
        },
      ],
    };
  };
  
  const ordersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#2F2F2F",
        },
      },
      title: {
        display: true,
        text: "Orders Over Time",
        color: "#2F2F2F",
      },
      tooltip: {
        titleColor: "#2F2F2F",
        bodyColor: "#2F2F2F",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#2F2F2F",
        },
        grid: {
          color: "rgba(47, 47, 47, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#2F2F2F",
        },
        grid: {
          color: "rgba(47, 47, 47, 0.1)",
        },
      },
    },
  };
  
  
  {/* Fetching data for summary_all */}
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token
            axios.get("https://biznex.onrender.com/dashboard/summary/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data);
                setTotalIncome(response.data.income.total);
                setTotalExpenses(response.data.expense.total);
                setChangeIncome(response.data.income.percent_change);
                setChangeExpenses(response.data.expense.percent_change);
                setTotalProfit(response.data.profit.total);
                setChangeProfit(response.data.profit.percent_change);
            })
            .catch(error => {
                console.error('Axios Error:', error.response ? error.response.data : error);
            });


            
            
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response && error.response.status === 401) {
              // Handle unauthorized access (e.g., redirect to login)
              alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
              
              router.push("/login");
          } else {
              // Handle other errors
              console.error("Error fetching data:", error);
              // Optionally, show an alert or notification to the user
          }
        }
    };

    fetchData();
}, []);


  return (
    <DashboardLayout>
      <div className="bg-opacity-0 p-4 text-[#2F2F2F]">
  <h1 className="text-lg font-semibold mb-4">Today's Summary</h1>

  {/* Bento Boxes (3 Columns) */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="bg-opacity-0 border border-[#2F2F2F] rounded-xl p-4">
      <div className="text-left">
        <h2 className="text-sm font-semibold text-[#2F2F2F]">Income</h2>
        <p className="text-lg text-[#2F2F2F]">
        ₹{totalIncome !== null ? totalIncome : "Loading..."}
        </p>
        <p className="text-xs text-[#2F2F2F]">
          Compared to last week:
          {changeIncome !== null ? (
              <span
              className={`ml-1 flex items-center ${
                  changeIncome > 0 ? "text-green-500" : "text-red-500"
              }`}
              >
              {`${changeIncome}%`}
              {changeIncome > 0 ? (
                  <FaArrowUp className="ml-1" />
              ) : (
                  <FaArrowDown className="ml-1" />
              )}
              </span>
          ) : (
              "Loading..."
          )}
        </p>
      </div>
    </div>

    <div className="bg-opacity-0 border border-[#2F2F2F] rounded-xl p-4">
      <div className="text-left">
        <h2 className="text-sm font-semibold text-[#2F2F2F]">Profit</h2>
        <p className="text-lg text-[#2F2F2F]">
          ₹{totalProfit !== null ? totalProfit : "Loading..."}

        </p>
        <p className="text-xs text-[#2F2F2F]">
          Compared to last week:
          {changeProfit !== null ? (
              <span
                className={`ml-1 flex items-center ${
                    changeProfit > 0 ? "text-green-500" : "text-red-500"
                }`}
                >
                {`${changeProfit}%`}
                {changeProfit > 0 ? (
                    <FaArrowUp className="ml-1" />
                ) : (
                    <FaArrowDown className="ml-1" />
                )}
              </span>
          ) : (
              "Loading..."
          )}
        </p>
      </div>
    </div>

    <div className="bg-opacity-0 border border-[#2F2F2F] rounded-xl p-4">
      <div className="text-left">
        <h2 className="text-sm font-semibold text-[#2F2F2F]">Expenses</h2>
        <p className="text-lg text-[#2F2F2F]">
        ₹{totalExpenses !== null ? totalExpenses : "Loading..."}
        </p>
        <p className="text-xs text-[#2F2F2F]">
          Compared to last week:
          {changeExpenses !== null ? (
              <span
                className={`ml-1 flex items-center ${
                    changeExpenses > 0 ? "text-green-500" : "text-red-500"
                }`}
                >
                {`${changeExpenses}%`}
                {changeExpenses > 0 ? (
                    <FaArrowUp className="ml-1" />
                ) : (
                    <FaArrowDown className="ml-1" />
                )}
              </span>
          ) : (
              "Loading..."
          )}
        </p>
      </div>
    </div>
  </div>

  {/* Single Full Width Graph */}
<div className="bg-opacity-0 border border-[#2F2F2F] rounded-xl p-4 mt-4"> 
  <div className="flex justify-end mb-4">
    <select
      className="bg-white text-[#2F2F2F] border border-[#2F2F2F] p-2 rounded-md"
      value={profitDateRange}
      onChange={(e) => setProfitDateRange(e.target.value)}
    >
      <option value="week">Last 7 Days</option>
      <option value="month">Last 28 Days</option>
      <option value="year">This Year</option>
    </select>
  </div>

  <h2 className="text-lg font-semibold text-[#2F2F2F] mb-4">Profit & Expenses Over Time</h2>

  <div style={{ height: '60vh' }}> {/* Added height style */}
    <Line
      data={getChartData(profitDateRange)}
      options={{
        ...chartOptions,
        elements: { line: { tension: 0.4 } },
      }}
      dataset={{
        fill: true,
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 0.5)',
        pointBackgroundColor: 'blue',
      }}
    />
  </div>
</div>
</div>

    </DashboardLayout>
  );
}

export default FinanceOverviewPage;