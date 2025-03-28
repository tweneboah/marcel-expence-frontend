import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaFileDownload,
  FaChartPie,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const BudgetSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [timePeriod, setTimePeriod] = useState("month"); // month, quarter, year
  const [year, setYear] = useState(new Date().getFullYear());
  const [statsData, setStatsData] = useState({
    totalBudgeted: 0,
    totalSpent: 0,
    percentUsed: 0,
    budgetsOverThreshold: 0,
    categoriesCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In production, call the actual APIs
        // const budgetsResponse = await axios.get('/api/v1/budgets');
        // const expensesResponse = await axios.get('/api/v1/expenses');

        // Mock data for demo
        // Simulate API call delay
        setTimeout(() => {
          // Mock budgets data
          const mockBudgets = [
            {
              _id: "60d5ec9af682fbf6bff91761",
              year: 2023,
              month: 11,
              category: {
                _id: "60d5ec9af682fbf6bff9175e",
                name: "Fuel",
                color: "#FF5722",
              },
              amount: 1200,
              maxDistance: 800,
              warningThreshold: 75,
              criticalThreshold: 90,
              isActive: true,
              notes: "Regular budget for November fuel expenses",
              createdAt: "2023-10-28T08:30:00.000Z",
              updatedAt: "2023-10-28T08:30:00.000Z",
            },
            {
              _id: "60d5ec9af682fbf6bff91762",
              year: 2023,
              month: 12,
              category: {
                _id: "60d5ec9af682fbf6bff9175f",
                name: "Tolls",
                color: "#2196F3",
              },
              amount: 450,
              maxDistance: 1200,
              warningThreshold: 80,
              criticalThreshold: 95,
              isActive: true,
              notes: "December toll expenses",
              createdAt: "2023-11-02T10:15:00.000Z",
              updatedAt: "2023-11-02T10:15:00.000Z",
            },
            {
              _id: "60d5ec9af682fbf6bff91763",
              year: 2023,
              month: 12,
              category: {
                _id: "60d5ec9af682fbf6bff91760",
                name: "Maintenance",
                color: "#4CAF50",
              },
              amount: 850,
              maxDistance: 0,
              warningThreshold: 70,
              criticalThreshold: 90,
              isActive: true,
              notes: "End of year vehicle maintenance budget",
              createdAt: "2023-11-10T14:20:00.000Z",
              updatedAt: "2023-11-10T14:20:00.000Z",
            },
            {
              _id: "60d5ec9af682fbf6bff91764",
              year: 2024,
              month: 1,
              category: {
                _id: "60d5ec9af682fbf6bff9175e",
                name: "Fuel",
                color: "#FF5722",
              },
              amount: 1100,
              maxDistance: 750,
              warningThreshold: 75,
              criticalThreshold: 90,
              isActive: true,
              notes: "January fuel expenses",
              createdAt: "2023-12-15T11:45:00.000Z",
              updatedAt: "2023-12-15T11:45:00.000Z",
            },
            {
              _id: "60d5ec9af682fbf6bff91765",
              year: 2024,
              month: 0,
              category: {
                _id: "60d5ec9af682fbf6bff91760",
                name: "Maintenance",
                color: "#4CAF50",
              },
              amount: 3600,
              maxDistance: 0,
              warningThreshold: 70,
              criticalThreshold: 90,
              isActive: true,
              notes: "Annual maintenance budget for 2024",
              createdAt: "2023-12-20T09:30:00.000Z",
              updatedAt: "2023-12-20T09:30:00.000Z",
            },
          ];

          // Mock expenses data
          const mockExpenses = [
            {
              _id: "60d5ec9af682fbf6bff91771",
              category: {
                _id: "60d5ec9af682fbf6bff9175e",
                name: "Fuel",
                color: "#FF5722",
              },
              amount: 880,
              date: "2023-11-15T10:30:00.000Z",
              distance: 580,
            },
            {
              _id: "60d5ec9af682fbf6bff91772",
              category: {
                _id: "60d5ec9af682fbf6bff9175f",
                name: "Tolls",
                color: "#2196F3",
              },
              amount: 270,
              date: "2023-12-05T14:20:00.000Z",
              distance: 720,
            },
            {
              _id: "60d5ec9af682fbf6bff91773",
              category: {
                _id: "60d5ec9af682fbf6bff91760",
                name: "Maintenance",
                color: "#4CAF50",
              },
              amount: 530,
              date: "2023-12-12T09:15:00.000Z",
              distance: 0,
            },
            {
              _id: "60d5ec9af682fbf6bff91774",
              category: {
                _id: "60d5ec9af682fbf6bff9175e",
                name: "Fuel",
                color: "#FF5722",
              },
              amount: 250,
              date: "2024-01-07T11:30:00.000Z",
              distance: 180,
            },
          ];

          setBudgets(mockBudgets);
          setExpenses(mockExpenses);

          // Calculate stats
          const totalBudgeted = mockBudgets
            .filter((b) => b.year === year)
            .reduce((sum, budget) => sum + budget.amount, 0);

          const totalSpent = mockExpenses
            .filter((e) => new Date(e.date).getFullYear() === year)
            .reduce((sum, expense) => sum + expense.amount, 0);

          const percentUsed =
            totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

          const categoriesCount = new Set(
            mockBudgets.map((b) => b.category._id)
          ).size;

          const budgetsOverThreshold = mockBudgets.filter((budget) => {
            const budgetExpenses = mockExpenses
              .filter(
                (e) =>
                  e.category._id === budget.category._id &&
                  new Date(e.date).getFullYear() === budget.year &&
                  (budget.month === 0 ||
                    new Date(e.date).getMonth() + 1 === budget.month)
              )
              .reduce((sum, expense) => sum + expense.amount, 0);

            const usagePercent = (budgetExpenses / budget.amount) * 100;
            return usagePercent >= budget.warningThreshold;
          }).length;

          setStatsData({
            totalBudgeted,
            totalSpent,
            percentUsed,
            budgetsOverThreshold,
            categoriesCount,
          });

          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching budget summary data:", err);
        setError("Failed to load budget summary. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [year, timePeriod]);

  const getBudgetChartData = () => {
    // Group budgets by category for the selected year and time period
    const categoryBudgets = {};
    const categoryExpenses = {};
    const categoryColors = {};

    // Filter budgets based on year and time period
    const filteredBudgets = budgets.filter((budget) => {
      if (budget.year !== year) return false;

      if (timePeriod === "year") {
        return true; // Include all budgets for the year
      } else if (timePeriod === "quarter") {
        if (budget.month === 0) return true; // Annual budgets are included
        const quarter = Math.ceil(budget.month / 3);
        const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
        return quarter === currentQuarter;
      } else {
        // month
        return budget.month === 0 || budget.month === new Date().getMonth() + 1;
      }
    });

    // Aggregate budgets by category
    filteredBudgets.forEach((budget) => {
      const categoryId = budget.category._id;
      categoryBudgets[categoryId] =
        (categoryBudgets[categoryId] || 0) + budget.amount;
      categoryColors[categoryId] = budget.category.color;
    });

    // Filter expenses based on year and time period
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() !== year) return false;

      if (timePeriod === "year") {
        return true; // Include all expenses for the year
      } else if (timePeriod === "quarter") {
        const expenseQuarter = Math.ceil((expenseDate.getMonth() + 1) / 3);
        const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
        return expenseQuarter === currentQuarter;
      } else {
        // month
        return expenseDate.getMonth() + 1 === new Date().getMonth() + 1;
      }
    });

    // Aggregate expenses by category
    filteredExpenses.forEach((expense) => {
      const categoryId = expense.category._id;
      categoryExpenses[categoryId] =
        (categoryExpenses[categoryId] || 0) + expense.amount;
    });

    // Prepare chart data
    const labels = filteredBudgets.map((budget) => budget.category.name);
    const uniqueLabels = [...new Set(labels)];

    const data = {
      labels: uniqueLabels,
      datasets: [
        {
          label: "Budget (CHF)",
          data: uniqueLabels.map((label) => {
            const categoryId = filteredBudgets.find(
              (b) => b.category.name === label
            )?.category._id;
            return categoryBudgets[categoryId] || 0;
          }),
          backgroundColor: uniqueLabels.map((label) => {
            const categoryId = filteredBudgets.find(
              (b) => b.category.name === label
            )?.category._id;
            return categoryColors[categoryId] || "#ccc";
          }),
          borderColor: uniqueLabels.map((label) => {
            const categoryId = filteredBudgets.find(
              (b) => b.category.name === label
            )?.category._id;
            return categoryColors[categoryId] || "#ccc";
          }),
          borderWidth: 1,
        },
        {
          label: "Spent (CHF)",
          data: uniqueLabels.map((label) => {
            const categoryId = filteredBudgets.find(
              (b) => b.category.name === label
            )?.category._id;
            return categoryExpenses[categoryId] || 0;
          }),
          backgroundColor: uniqueLabels.map((label) => {
            const categoryId = filteredBudgets.find(
              (b) => b.category.name === label
            )?.category._id;
            const color = categoryColors[categoryId] || "#ccc";
            return color + "80"; // Add transparency
          }),
          borderColor: uniqueLabels.map((label) => {
            const categoryId = filteredBudgets.find(
              (b) => b.category.name === label
            )?.category._id;
            return categoryColors[categoryId] || "#ccc";
          }),
          borderWidth: 1,
        },
      ],
    };

    return data;
  };

  const getMonthlyTrendData = () => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Aggregate monthly budgets and expenses
    const monthlyBudgets = months.map((month) => {
      return budgets
        .filter((b) => b.year === year && (b.month === month || b.month === 0))
        .reduce((sum, budget) => {
          // For annual budgets, distribute evenly across months
          const amount =
            budget.month === 0 ? budget.amount / 12 : budget.amount;
          return sum + amount;
        }, 0);
    });

    const monthlyExpenses = months.map((month) => {
      return expenses
        .filter((e) => {
          const date = new Date(e.date);
          return date.getFullYear() === year && date.getMonth() + 1 === month;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Budget (CHF)",
          data: monthlyBudgets,
          borderColor: "#4CAF50",
          backgroundColor: "#4CAF5033",
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
        {
          label: "Expenses (CHF)",
          data: monthlyExpenses,
          borderColor: "#F44336",
          backgroundColor: "#F4433633",
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
      ],
    };
  };

  const getCategoryDistributionData = () => {
    // Group expenses by category
    const categoryExpenses = {};
    const categoryColors = {};

    // Filter expenses for the selected year
    const yearExpenses = expenses.filter(
      (e) => new Date(e.date).getFullYear() === year
    );

    // Aggregate expenses by category
    yearExpenses.forEach((expense) => {
      const categoryId = expense.category._id;
      const categoryName = expense.category.name;
      categoryExpenses[categoryName] =
        (categoryExpenses[categoryName] || 0) + expense.amount;
      categoryColors[categoryName] = expense.category.color;
    });

    const data = {
      labels: Object.keys(categoryExpenses),
      datasets: [
        {
          data: Object.values(categoryExpenses),
          backgroundColor: Object.keys(categoryExpenses).map(
            (cat) => categoryColors[cat] || "#ccc"
          ),
          borderColor: Object.keys(categoryExpenses).map(
            (cat) => categoryColors[cat] || "#ccc"
          ),
          borderWidth: 1,
        },
      ],
    };

    return data;
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return (
      <>
        <option value={currentYear - 1}>{currentYear - 1}</option>
        <option value={currentYear}>{currentYear}</option>
        <option value={currentYear + 1}>{currentYear + 1}</option>
      </>
    );
  };

  const exportSummary = () => {
    const summaryData = {
      year,
      timePeriod,
      stats: statsData,
      budgets: budgets.filter((b) => b.year === year),
      expenses: expenses.filter((e) => new Date(e.date).getFullYear() === year),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(summaryData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `budget_summary_${year}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <FaChartPie className="mr-2" /> Budget Summary
          </h1>
          <button
            onClick={exportSummary}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
            disabled={isLoading}
          >
            <FaFileDownload className="mr-2" /> Export Report
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              Year:
            </label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="p-2 border rounded w-full"
              disabled={isLoading}
            >
              {getYearOptions()}
            </select>
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              Period:
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="p-2 border rounded w-full"
              disabled={isLoading}
            >
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 shadow">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Total Budgeted
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {statsData.totalBudgeted.toLocaleString("de-CH", {
                    style: "currency",
                    currency: "CHF",
                  })}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 shadow">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Total Spent
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {statsData.totalSpent.toLocaleString("de-CH", {
                    style: "currency",
                    currency: "CHF",
                  })}
                </p>
              </div>

              <div
                className={`rounded-lg p-4 shadow ${
                  statsData.percentUsed > 90
                    ? "bg-red-50"
                    : statsData.percentUsed > 75
                    ? "bg-yellow-50"
                    : "bg-blue-50"
                }`}
              >
                <h3
                  className={`text-sm font-medium mb-2 ${
                    statsData.percentUsed > 90
                      ? "text-red-800"
                      : statsData.percentUsed > 75
                      ? "text-yellow-800"
                      : "text-blue-800"
                  }`}
                >
                  Budget Utilization
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    statsData.percentUsed > 90
                      ? "text-red-600"
                      : statsData.percentUsed > 75
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {statsData.percentUsed.toFixed(1)}%
                </p>
              </div>

              <div
                className={`rounded-lg p-4 shadow ${
                  statsData.budgetsOverThreshold > 0
                    ? "bg-yellow-50"
                    : "bg-green-50"
                }`}
              >
                <h3
                  className={`text-sm font-medium mb-2 ${
                    statsData.budgetsOverThreshold > 0
                      ? "text-yellow-800"
                      : "text-green-800"
                  }`}
                >
                  Budgets Over Threshold
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    statsData.budgetsOverThreshold > 0
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {statsData.budgetsOverThreshold}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 shadow border">
                <h3 className="text-lg font-medium mb-4">
                  Budget vs. Actual Spending by Category
                </h3>
                <div className="h-80">
                  <Bar
                    data={getBudgetChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Amount (CHF)",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow border">
                <h3 className="text-lg font-medium mb-4">
                  Category Distribution
                </h3>
                <div className="h-80">
                  <Pie
                    data={getCategoryDistributionData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || "";
                              const value = context.parsed;
                              const total = context.dataset.data.reduce(
                                (a, b) => a + b,
                                0
                              );
                              const percentage = Math.round(
                                (value / total) * 100
                              );
                              return `${label}: ${value.toLocaleString(
                                "de-CH",
                                { style: "currency", currency: "CHF" }
                              )} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border mb-6">
              <h3 className="text-lg font-medium mb-4">Monthly Budget Trend</h3>
              <div className="h-80">
                <Line
                  data={getMonthlyTrendData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Amount (CHF)",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Links to other reports */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-medium mb-3">Related Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link
                  to="/admin/reports/budget-comparison"
                  className="block p-3 bg-white rounded border hover:bg-blue-50"
                >
                  Budget Comparison
                </Link>
                <Link
                  to="/admin/reports/all-budgets"
                  className="block p-3 bg-white rounded border hover:bg-blue-50"
                >
                  All Budgets Report
                </Link>
                <Link
                  to="/admin/budgets"
                  className="block p-3 bg-white rounded border hover:bg-blue-50"
                >
                  Manage Budgets
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
