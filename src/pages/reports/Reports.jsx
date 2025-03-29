import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/apiConfig";
import { FaFileExport, FaProjectDiagram } from "react-icons/fa";

const Reports = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("month");
  const [chartData, setChartData] = useState({
    month: {
      totalExpenses: 457,
      totalDistance: 1540,
      expenses: [
        { category: "Week 1", amount: 120 },
        { category: "Week 2", amount: 95 },
        { category: "Week 3", amount: 145 },
        { category: "Week 4", amount: 97 },
      ],
    },
    quarter: {
      totalExpenses: 1250,
      totalDistance: 4180,
      expenses: [
        { category: "Month 1", amount: 457 },
        { category: "Month 2", amount: 389 },
        { category: "Month 3", amount: 404 },
      ],
    },
    year: {
      totalExpenses: 5430,
      totalDistance: 18140,
      expenses: [
        { category: "Q1", amount: 1250 },
        { category: "Q2", amount: 1380 },
        { category: "Q3", amount: 1450 },
        { category: "Q4", amount: 1350 },
      ],
    },
  });

  // Calculate max value for the chart scale
  const maxValue = Math.max(
    ...chartData[period].expenses.map((item) => item.amount)
  );
  const scale = maxValue * 1.2; // Add 20% padding to the top

  const handleExport = (format) => {
    // This would generate a PDF or CSV in a real application
    console.log(`Exporting as ${format}...`);
    alert(
      `Your ${period} report has been exported as ${format.toUpperCase()}.`
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Expense Reports</h1>
        <p className="text-gray-600">
          Select a report type to view detailed information
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
          <div className="text-3xl font-bold text-indigo-600">
            CHF {chartData[period].totalExpenses.toFixed(2)}
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {period === "month"
              ? "This month"
              : period === "quarter"
              ? "This quarter"
              : "This year"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Distance</h2>
          <div className="text-3xl font-bold text-green-600">
            {chartData[period].totalDistance} km
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {period === "month"
              ? "This month"
              : period === "quarter"
              ? "This quarter"
              : "This year"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Reports Generated</h2>
          <div className="text-3xl font-bold text-blue-600">12</div>
          <p className="text-gray-500 text-sm mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Export options */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-lg font-semibold mb-4">Export Options</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center"
          >
            <FaFileExport className="mr-2" />
            Export as PDF
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
          >
            <FaFileExport className="mr-2" />
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
