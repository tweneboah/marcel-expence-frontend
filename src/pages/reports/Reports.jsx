import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/apiConfig";
import {
  FaChartPie,
  FaChartLine,
  FaFileAlt,
  FaCalendarAlt,
  FaFilter,
  FaBalanceScale,
  FaChartBar,
  FaFileExport,
  FaChartArea,
  FaWallet,
  FaMoneyBillWave,
  FaProjectDiagram,
} from "react-icons/fa";

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

  // Report navigation cards
  const reportCards = [
    {
      id: "ytd",
      title: "YTD Reports",
      description: "View comprehensive year-to-date expense reports",
      icon: <FaCalendarAlt className="h-8 w-8 text-green-500" />,
      path: "/admin/reports/ytd",
      apiEndpoint: `${BASE_URL}/advanced-reports/ytd`,
    },
    {
      id: "chart-data",
      title: "Chart Data",
      description:
        "Visualize expenses data with customizable charts (pie, bar, line)",
      icon: <FaChartPie className="h-8 w-8 text-blue-500" />,
      path: "/admin/reports/chart-data",
      apiEndpoint: `${BASE_URL}/advanced-reports/chart-data`,
    },
    {
      id: "forecast",
      title: "Expense Forecasting",
      description: "Predict future expenses based on historical data",
      icon: <FaChartLine className="h-8 w-8 text-indigo-500" />,
      path: "/admin/reports/expense-forecasting",
      apiEndpoint: `${BASE_URL}/advanced-reports/expense-forecasting`,
    },
    {
      id: "advanced-forecast",
      title: "Advanced Forecast",
      description:
        "Predict expenses with statistical models and confidence intervals",
      icon: <FaChartArea className="h-8 w-8 text-teal-500" />,
      path: "/admin/reports/forecast",
      apiEndpoint: `${BASE_URL}/advanced-reports/forecast`,
    },
    {
      id: "budget-comparison",
      title: "Budget Comparison",
      description: "Compare budgeted vs. actual expenses by category",
      icon: <FaBalanceScale className="h-8 w-8 text-yellow-500" />,
      path: "/admin/reports/budget-comparison",
      apiEndpoint: `${BASE_URL}/advanced-reports/budget-comparison`,
    },
    {
      id: "filtered-expenses",
      title: "Filtered Expenses",
      description: "Search and filter expenses with advanced criteria",
      icon: <FaFilter className="h-8 w-8 text-purple-500" />,
      path: "/admin/reports/filtered-expenses",
      apiEndpoint: `${BASE_URL}/advanced-reports/expenses`,
    },
    {
      id: "budget-summary",
      title: "Budget Summary",
      description: "View summary of all budget allocations and usage",
      icon: <FaWallet className="h-8 w-8 text-orange-500" />,
      path: "/admin/reports/budget-summary",
      apiEndpoint: `${BASE_URL}/budgets/summary`,
    },
    {
      id: "all-budgets",
      title: "All Budgets",
      description: "List and manage all budget entries",
      icon: <FaMoneyBillWave className="h-8 w-8 text-red-500" />,
      path: "/admin/reports/all-budgets",
      apiEndpoint: `${BASE_URL}/budgets`,
    },
    {
      id: "budget-details",
      title: "Budget Details",
      description: "View detailed information about a specific budget",
      icon: <FaProjectDiagram className="h-8 w-8 text-cyan-500" />,
      path: "/admin/reports/budget-details",
      apiEndpoint: `${BASE_URL}/budgets/:id`,
    },
  ];

  // Handle navigation when clicking a report card
  const handleReportCardClick = (path) => {
    navigate(path);
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

      <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {reportCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleReportCardClick(card.path)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-gray-50 hover:translate-y-[-2px]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-gray-100 mb-3">
                {card.icon}
              </div>
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="text-gray-600 mt-1 mb-3 text-sm">
                {card.description}
              </p>
              <div className="text-xs text-gray-500 mt-auto">
                {card.apiEndpoint}
              </div>
              <div className="text-blue-600 text-sm mt-2 flex items-center justify-center">
                View Report <span className="ml-1">→</span>
              </div>
            </div>
          </div>
        ))}
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
