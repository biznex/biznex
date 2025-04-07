"use client";

import React, { useState } from "react";
import DashboardLayout from "../../components/dashboardlayout";
import { PieChart, Pie, Cell } from "recharts";

const TaxEstimate = () => {
  const [businessType, setBusinessType] = useState("Presumptive Taxation (44AD)");
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [financialYear, setFinancialYear] = useState("2023-2024");
  const [digitalRevenuePercentage, setDigitalRevenuePercentage] = useState(50);
  const [depreciation, setDepreciation] = useState(0);
  const [professionalTax, setProfessionalTax] = useState(0);
  const [investmentAllowances, setInvestmentAllowances] = useState(0);
  const [researchAndDevelopmentExpenses, setResearchAndDevelopmentExpenses] = useState(0);
  const [capitalGains, setCapitalGains] = useState(0);
  const [turnover, setTurnover] = useState(0);
  const [specialDeductions, setSpecialDeductions] = useState(0);
  const [taxAmount, setTaxAmount] = useState(null);
  const [cessPercentage, setCessPercentage] = useState(4);
  const [surchargePercentage, setSurchargePercentage] = useState(10);
  const [stateTax, setStateTax] = useState(0);
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState(0);
  const [taxCredit, setTaxCredit] = useState(0);
  const [taxLiability, setTaxLiability] = useState(0);

  const calculateIndianBusinessTax = () => {
    let totalTax = 0;
    let netTaxLiability = 0;

    // Constants (Example - Adjust as needed for current financial year)
    const PRESUMPTIVE_INCOME_RATE_SMALL_BUSINESS = 0.08;
    const PRESUMPTIVE_INCOME_RATE_DIGITAL_TRANSACTIONS = 0.06;

    // Tax Brackets and Rates (Example - Adjust for current financial year)
    const BRACKETS = [250000, 500000, 1000000, Infinity];
    const RATES = [0.00, 0.05, 0.20, 0.30];

    let taxableIncome = 0;

    if (businessType === "Presumptive Taxation (44AD)") {
      const digitalTurnover = (revenue * digitalRevenuePercentage) / 100;
      const cashTurnover = revenue - digitalTurnover;

      const assumedIncome =
        cashTurnover * PRESUMPTIVE_INCOME_RATE_SMALL_BUSINESS +
        digitalTurnover * PRESUMPTIVE_INCOME_RATE_DIGITAL_TRANSACTIONS;

      taxableIncome = assumedIncome - deductions;
    } else if (businessType === "Regular Business") {
      taxableIncome =
        revenue -
        expenses -
        deductions -
        depreciation -
        professionalTax -
        researchAndDevelopmentExpenses -
        specialDeductions;
      taxableIncome += capitalGains;
    } else {
      alert("Invalid Business Type");
      return;
    }

    if (taxableIncome < 0) {
      taxableIncome = 0;
    }

    taxableIncome -= investmentAllowances;

    if (taxableIncome < 0) {
      taxableIncome = 0;
    }

    const taxOwed = calculateTaxBrackets(taxableIncome, BRACKETS, RATES);

    const surcharge = taxableIncome > 10000000 ? (taxOwed * surchargePercentage) / 100 : 0;
    const cess = (taxOwed + surcharge) * (cessPercentage / 100);

    totalTax = taxOwed + surcharge + cess + stateTax;
    netTaxLiability = totalTax - advanceTaxPaid - taxCredit;

    setTaxAmount(totalTax);
    setTaxLiability(netTaxLiability);
  };

  const calculateTaxBrackets = (taxableIncome, brackets, rates) => {
    let taxOwed = 0;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < brackets.length; i++) {
      if (remainingIncome <= 0) {
        break;
      }

      const bracketMax = brackets[i];

      let taxableInThisBracket = 0;
      if (i === brackets.length - 1 || remainingIncome < bracketMax) {
        taxableInThisBracket = remainingIncome;
      } else {
        taxableInThisBracket = bracketMax - (i > 0 ? brackets[i - 1] : 0);
      }

      taxOwed += taxableInThisBracket * rates[i];
      remainingIncome -= taxableInThisBracket;
    }

    return taxOwed;
  };

  const pieChartData = [
    { name: "Tax Owed", value: taxAmount || 0 },
    { name: "Surcharge", value: (taxAmount || 0) * (surchargePercentage / 100) },
    { name: "Cess", value: (taxAmount || 0) * (cessPercentage / 100) },
  ];

  const pieChartData2 = [
    { name: "Revenue", value: revenue || 0 },
    { name: "Expenses", value: expenses || 0 },
    { name: "Deductions", value: deductions || 0 },
  ];

  const pieChartData3 = [
    { name: "Advance Tax", value: advanceTaxPaid || 0 },
    { name: "Tax Credit", value: taxCredit || 0 },
    { name: "State Tax", value: stateTax || 0 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <DashboardLayout>
      <div className="p-4 text-[#2F2F2F]">
        <h2 className="text-2xl font-bold mb-4">Business Tax Estimate Calculator</h2>

        <div className="flex">
          <div className="w-3/4 pr-4 rounded-lg border border-black p-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Business Type:</label>
                <select
                  className="border p-2 w-full"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  <option value="Presumptive Taxation (44AD)">Presumptive Taxation (44AD)</option>
                  <option value="Regular Business">Regular Business</option>
                </select>
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Revenue:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={revenue}
                  onChange={(e) => setRevenue(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Expenses:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={expenses}
                  onChange={(e) => setExpenses(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Deductions:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={deductions}
                  onChange={(e) => setDeductions(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Digital Revenue (%):</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={digitalRevenuePercentage}
                  onChange={(e) => setDigitalRevenuePercentage(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Depreciation:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={depreciation}
                  onChange={(e) => setDepreciation(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Professional Tax:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={professionalTax}
                  onChange={(e) => setProfessionalTax(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Investment Allowances:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={investmentAllowances}
                  onChange={(e) => setInvestmentAllowances(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">R&D Expenses:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={researchAndDevelopmentExpenses}
                  onChange={(e) => setResearchAndDevelopmentExpenses(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Capital Gains:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={capitalGains}
                  onChange={(e) => setCapitalGains(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Turnover:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={turnover}
                  onChange={(e) => setTurnover(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Special Deductions:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={specialDeductions}
                  onChange={(e) => setSpecialDeductions(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">State Tax:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={stateTax}
                  onChange={(e) => setStateTax(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Advance Tax Paid:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={advanceTaxPaid}
                  onChange={(e) => setAdvanceTaxPaid(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-1/2 px-2 mb-4">
                <label className="block mb-2">Tax Credit:</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={taxCredit}
                  onChange={(e) => setTaxCredit(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-full px-2 mb-4">
                <label className="block mb-2">Financial Year:</label>
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-1/4 rounded-lg border border-black p-4">
            {taxAmount !== null && (
              <>
                <PieChart width={250} height={150}>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <p className="text-center">Tax Breakdown</p>

                <PieChart width={250} height={150}>
                  <Pie
                    data={pieChartData2}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <p className="text-center">Revenue/Expenses</p>

                <PieChart width={250} height={150}>
                  <Pie
                    data={pieChartData3}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData3.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <p className="text-center">Tax Credits</p>

                <p className="font-bold">Estimated Tax: ₹{taxAmount.toFixed(2)}</p>
                <p className="font-bold">Net Tax Liability: ₹{taxLiability.toFixed(2)}</p>
              </>
            )}
          </div>
        </div>

        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={calculateIndianBusinessTax}
        >
          Calculate Tax
        </button>
      </div>
    </DashboardLayout>
  );
};

export default TaxEstimate;