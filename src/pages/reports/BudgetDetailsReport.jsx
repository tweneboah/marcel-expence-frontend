import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaEdit,
  FaTrash,
  FaFileExport,
  FaChartBar,
} from "react-icons/fa";
import axios from "axios";

const BudgetDetailsReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budget, setBudget] = useState(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState(id || "");
  const [budgetOptions, setBudgetOptions] = useState([]);

  useEffect(() => {
    // Fetch list of budget options
    const fetchBudgetOptions = async () => {
      try {
        // This would be a real API call in production
        // const response = await axios.get('/api/v1/budgets?fields=_id,year,month,category&limit=100');
        // setBudgetOptions(response.data.data);

        // Mock data for demo
        setTimeout(() => {
          setBudgetOptions([
            {
              _id: "budget-1",
              year: 2023,
              month: 12,
              category: { name: "Fuel" },
              periodName: "December 2023 - Fuel",
            },
            {
              _id: "budget-2",
              year: 2023,
              month: 11,
              category: { name: "Fuel" },
              periodName: "November 2023 - Fuel",
            },
            {
              _id: "budget-3",
              year: 2023,
              month: 11,
              category: { name: "Tolls" },
              periodName: "November 2023 - Tolls",
            },
          ]);
        }, 500);
      } catch (err) {
        console.error("Failed to fetch budget options:", err);
      }
    };

    fetchBudgetOptions();
  }, []);

  useEffect(() => {
    if (!selectedBudgetId) return;

    const fetchBudgetDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This would be a real API call in production
        // const response = await axios.get(`/api/v1/budgets/${selectedBudgetId}`);
        // setBudget(response.data.data);

        // Mock data for demo
        setTimeout(() => {
          setBudget({
            _id: selectedBudgetId,
            user: { _id: "user-1", name: "John Doe" },
            year: 2023,
            month: 12,
            category: {
              _id: "fuel-1",
              name: "Fuel",
              color: "#FF5722",
            },
            amount: 300.0,
            maxDistance: 400.0,
            isActive: true,
            notes: "Budget for December fuel expenses",
            warningThreshold: 80,
            criticalThreshold: 95,
            createdAt: "2023-04-15T08:30:00.000Z",
            updatedAt: "2023-04-15T08:30:00.000Z",
            usage: {
              totalExpenses: 7,
              totalCost: 175.25,
              totalDistance: 245.3,
              usagePercentage: 58,
              status: "under",
              remaining: 124.75,
            },
            periodName: "December 2023",
            expenses: [
              {
                id: "expense-1",
                date: "2023-12-05T08:30:00.000Z",
                from: "Zürich, Switzerland",
                to: "Bern, Switzerland",
                distance: 126.5,
                cost: 88.55,
                category: {
                  id: "fuel-1",
                  name: "Fuel",
                  color: "#FF5722",
                },
              },
              {
                id: "expense-2",
                date: "2023-12-12T10:15:00.000Z",
                from: "Zürich, Switzerland",
                to: "Lucerne, Switzerland",
                distance: 52.3,
                cost: 36.61,
                category: {
                  id: "fuel-1",
                  name: "Fuel",
                  color: "#FF5722",
                },
              },
              {
                id: "expense-3",
                date: "2023-12-18T14:45:00.000Z",
                from: "Zürich, Switzerland",
                to: "Basel, Switzerland",
                distance: 86.5,
                cost: 60.55,
                category: {
                  id: "fuel-1",
                  name: "Fuel",
                  color: "#FF5722",
                },
              },
            ],
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch budget details");
        setIsLoading(false);
      }
    };

    fetchBudgetDetails();
  }, [selectedBudgetId]);

  const handleBudgetChange = (e) => {
    const newBudgetId = e.target.value;
    setSelectedBudgetId(newBudgetId);

    // Update URL without full page reload
    if (newBudgetId) {
      navigate(`/admin/reports/budget-details/${newBudgetId}`, {
        replace: true,
      });
    } else {
      navigate("/admin/reports/budget-details", { replace: true });
    }
  };

  const handleEditBudget = () => {
    navigate(`/admin/budgets/edit/${selectedBudgetId}`);
  };

  const handleDeleteBudget = () => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      alert("Budget deletion would be handled here");
    }
  };

  const handleExport = (format) => {
    alert(`Exporting budget details as ${format}`);
  };

  if (!selectedBudgetId) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <FaProjectDiagram className="mr-2" /> Budget Details Report
            </h1>
            <p className="text-gray-600">
              API Endpoint: <code>/api/v1/budgets/:id</code>
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Select a Budget</h2>
          <div className="max-w-md">
            <select
              value={selectedBudgetId}
              onChange={handleBudgetChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Please select a budget</option>
              {budgetOptions.map((budget) => (
                <option key={budget._id} value={budget._id}>
                  {budget.periodName ||
                    `${budget.year}-${budget.month} ${budget.category.name}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FaProjectDiagram className="mr-2" /> Budget Details
          </h1>
          <p className="text-gray-600">
            API Endpoint: <code>/api/v1/budgets/{budget._id}</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedBudgetId}
            onChange={handleBudgetChange}
            className="p-2 border rounded-md"
          >
            <option value="">Select a different budget</option>
            {budgetOptions.map((budgetOption) => (
              <option key={budgetOption._id} value={budgetOption._id}>
                {budgetOption.periodName ||
                  `${budgetOption.year}-${budgetOption.month} ${budgetOption.category.name}`}
              </option>
            ))}
          </select>
          <button
            onClick={handleEditBudget}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDeleteBudget}
            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FaTrash />
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <FaFileExport />
          </button>
        </div>
      </div>

      {budget && (
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <FaChartBar className="mr-2" /> Budget Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Period</div>
                <div className="text-lg font-medium">{budget.periodName}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Category</div>
                <div className="text-lg font-medium flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: budget.category.color }}
                  ></div>
                  {budget.category.name}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Budget Amount</div>
                <div className="text-lg font-medium">
                  CHF {budget.amount.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Max Distance</div>
                <div className="text-lg font-medium">
                  {budget.maxDistance} km
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-sm text-blue-600">Actual Expenses</div>
                <div className="text-lg font-medium">
                  CHF {budget.usage.totalCost.toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <div className="text-sm text-green-600">Remaining</div>
                <div className="text-lg font-medium">
                  CHF {budget.usage.remaining.toFixed(2)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-md">
                <div className="text-sm text-purple-600">Distance Traveled</div>
                <div className="text-lg font-medium">
                  {budget.usage.totalDistance} km
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-md">
                <div className="text-sm text-orange-600">Usage Percentage</div>
                <div className="text-lg font-medium">
                  {budget.usage.usagePercentage}%
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      budget.usage.usagePercentage > 90
                        ? "bg-red-600"
                        : budget.usage.usagePercentage > 75
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${budget.usage.usagePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {budget.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-500 mb-1">Notes</div>
                <div>{budget.notes}</div>
              </div>
            )}
          </div>

          {/* Expenses List */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">
              Related Expenses ({budget.expenses.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2 text-right">Distance</th>
                    <th className="px-4 py-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {budget.expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{expense.from}</td>
                      <td className="px-4 py-3">{expense.to}</td>
                      <td className="px-4 py-3 text-right">
                        {expense.distance} km
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        CHF {expense.cost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right">
                      {budget.usage.totalDistance} km
                    </td>
                    <td className="px-4 py-3 text-right">
                      CHF {budget.usage.totalCost.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Budget Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Budget Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-500">Warning Threshold</div>
                <div className="text-lg font-medium">
                  {budget.warningThreshold}%
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-500">Critical Threshold</div>
                <div className="text-lg font-medium">
                  {budget.criticalThreshold}%
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-lg font-medium flex items-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                      budget.usage.status === "over"
                        ? "bg-red-500"
                        : budget.usage.status === "warning"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  >
                    {budget.usage.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetDetailsReport;
