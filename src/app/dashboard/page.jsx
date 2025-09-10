// src/app/dashboard/page.jsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from './components/dashboardlayout';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Import arrow icons
import axios from "axios";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function DashboardPage() {
    const router = useRouter();
    let showTokenErrorAlert = false; // Flag to control alert display


    const [profitDateRange, setProfitDateRange] = useState('week');
    const [orderDateRange, setOrderDateRange] = useState('week');

    const [totalIncome, setTotalIncome] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(null);
    const [totalOrders, setTotalOrders] = useState(null);
    const [changeIncome, setChangeIncome] = useState(null);
    const [changeExpenses, setChangeExpenses] = useState(null);
    const [changeOrders, setChangeOrders] = useState(null);
    const [totalProfit, setTotalProfit] = useState(null);
    const [changeProfit, setChangeProfit] = useState(null);
    const [totalProfitArray, setTotalProfitArray] = useState([]);
    const [totalExpensesArray, setTotalExpensesArray] = useState([]);
    const [labelArray, setLabelArray] = useState([]);
    const [totalOrdersArray, setTotalOrdersArray] = useState([]);
    const [orderLabelArray, setOrderLabelArray] = useState([]);

    {/* Fetching data for profit and expense chart */}
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
              const tpa = response.data.map((item) => parseFloat(item.total_profit));
              setTotalProfitArray(tpa);
              const tea = response.data.map((item) => parseFloat(item.total_expense));
              setTotalExpensesArray(tea);
              const lA = response.data.map((item) => item.label); // Assuming 'date' is the field in your response
              setLabelArray(lA);
          } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error (e.g., show an alert or redirect to login)
            if (error.response && error.response.status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
                if (!showTokenErrorAlert) {
                  showTokenErrorAlert = true; // Set the flag to true to prevent multiple alerts
                alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
                }
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


    {/* Fetching data for orders chart */}
    useEffect(() => {
      const fetchData = async () => {
          try {
              const token = localStorage.getItem("token"); // Get token
              console.log("Order date range:", orderDateRange);
              const response = await axios.post(
                  "https://biznex.onrender.com/dashboard/orders/group",
                  { groupBy: orderDateRange }, // Corrected request body
                  {
                      headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                      },
                  }
              );

              console.log(response.data);
               // Log the date range
              const toa = response.data.map((item) => parseFloat(item.total_orders));
              setTotalOrdersArray(toa);
              const ola = response.data.map((item) => item.label); // Assuming 'date' is the field in your response
              setOrderLabelArray(ola);
          } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error (e.g., show an alert or redirect to login)
            if (error.response && error.response.status === 401) {
              // Handle unauthorized access (e.g., redirect to login)
              if (!showTokenErrorAlert) {
                showTokenErrorAlert = true; // Set the flag to true to prevent multiple alerts
              alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
              }
              router.push("/login");
          } else {
                // Handle other errors
                console.error("Error fetching data:", error);
                // Optionally, show an alert or notification to the user
            }
            
            
          }
      };

      fetchData(); // Call the function whenever profitDateRange changes
  }, [orderDateRange]);



  const getChartData = () => {
    switch (profitDateRange) {
      case "week":
        return {
          labels: labelArray,
          datasets: [
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
    //labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`), // Generates labels for Day 1 to Day 30
    labels: labelArray,
    datasets: [
      {
        label: "Profit",
        data: totalProfitArray, // Example profit data for 30 days
        fill: false,
        backgroundColor: "green",
        borderColor: "rgba(0, 255, 0, 0.5)",
      },
      {
        label: "Expenses",
        data: totalExpensesArray, // Example expenses data for 30 days
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
    
  
    return {
      labels: orderLabelArray,
      datasets: [
        {
          label: "Orders",
          data: totalOrdersArray,
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
                if (!token) {
                    router.push('/login'); // Redirect to login if token is not available
                    return;
                }
                axios.get("https://biznex.onrender.com/dashboard/summary/all", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    console.log(response.data);
                    setTotalIncome(response.data.income.total);
                    setTotalExpenses(response.data.expense.total);
                    setTotalOrders(response.data.orders.total);
                    setChangeIncome(response.data.income.percent_change);
                    setChangeExpenses(response.data.expense.percent_change);
                    setChangeOrders(response.data.orders.percent_change);
                    setTotalProfit(response.data.profit.total);
                    setChangeProfit(response.data.profit.percent_change);
                })
                .catch(error => {
                    console.error('Axios Error:', error.response ? error.response.data : error);
                });


                
                
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error (e.g., show an alert or redirect to login)
                if (error.response && error.response.status === 401) {
                  // Handle unauthorized access (e.g., redirect to login)
                  if (!showTokenErrorAlert) {
                    showTokenErrorAlert = true; // Set the flag to true to prevent multiple alerts
                  alert("Unauthorized access,Failed to load dashboard data.. Please log in again.");
                  }
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Bento Boxes (Modified) */}
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

              <div className="bg-opacity-0 border border-[#2F2F2F] rounded-xl p-4">
                <div className="text-left">
                    <h2 className="text-sm font-semibold text-[#2F2F2F]">Orders</h2>
                    <p className="text-lg text-[#2F2F2F]">
                    {totalOrders !== null ? totalOrders : "Loading..."}
                    </p>
                    <p className="text-xs text-[#2F2F2F]">
                    Compared to last week: 
                    {changeOrders !== null ? (
                        <span
                        className={`ml-1 flex items-center ${
                            changeOrders > 0 ? "text-green-500" : "text-red-500"
                        }`}
                        >
                        {`${changeOrders}%`}
                        {changeOrders > 0 ? (
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

    
    {/* Profit/Expenses Graph */}
    <div className="col-span-2 bg-opacity-0 border border-[#2F2F2F] rounded-xl p-4">
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
    
      <Line
        data={getChartData(profitDateRange)}
        options={{
          ...chartOptions,
          elements: {
            line: { tension: 0.4 }, // Smooth curve
          },
        }}
        dataset={{
          fill: true, // Enables the area effect
          backgroundColor: 'rgba(0, 123, 255, 0.2)', // Lighter shade for area
          borderColor: 'rgba(0, 123, 255, 0.5)', // Border color
          pointBackgroundColor: 'blue',
        }}
      />
    </div>
    
    
    
    {/* Orders Graph */}
    <div className="col-span-2 bg-opacity-0 border border-[#2F2F2F] rounded-xl p-4">
      <div className="flex justify-end mb-4">
        <select
          className="bg-white text-[#2F2F2F] border border-[#2F2F2F] p-2 rounded-md"
          value={orderDateRange}
          onChange={(e) => setOrderDateRange(e.target.value)}
        >
          
          <option value="week">Last 7 Days</option>
          <option value="month">Last 28 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>
    
      <h2 className="text-lg font-semibold text-[#2F2F2F] mb-4">Orders Over Time</h2>
    
      <Line data={getOrdersData(orderDateRange)} options={ordersChartOptions} />
    </div>
    
    
              
            </div>
          </div>
        </DashboardLayout>
      );
//};
}

export default DashboardPage;