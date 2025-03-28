import React, { useState, useEffect } from "react";
import { FaWallet, FaFilter, FaFileExport } from "react-icons/fa";
import axios from "axios";

const BudgetSummaryReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchBudgetSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Replace with actual API call when backend is ready
        // const response = await axios.get(`/api/v1/budgets/summary?year=${year}`);
        // setSummaryData(response.data.data);

        // Mock data for now
        setTimeout(() => {
          setSummaryData({
            year: 2023,
            monthly: [
              {
                month: 0,
                periodName: "Annual 2023",
                budgeted: 5000.0,
                actual: 3250.75,
                remaining: 1749.25,
                count: 5,
                percentage: 65,
              },
              {
                month: 1,
                periodName: "January 2023",
                budgeted: 400.0,
                actual: 250.25,
                remaining: 149.75,
                count: 1,
                percentage: 63,
              },
              {
                month: 2,
                periodName: "February 2023",
                budgeted: 420.0,
                actual: 301.5,
                remaining: 118.5,
                count: 2,
                percentage: 72,
              },
            ],
            categories: [
              {
                categoryId: "fuel-1",
                categoryName: "Fuel",
                categoryColor: "#FF5722",
                budgeted: 3000.0,
                actual: 1950.5,
                remaining: 1049.5,
                percentage: 65,
              },
              {
                categoryId: "tolls-1",
                categoryName: "Tolls",
                categoryColor: "#2196F3",
                budgeted: 1000.0,
                actual: 750.25,
                remaining: 249.75,
                percentage: 75,
              },
              {
                categoryId: "maintenance-1",
                categoryName: "Maintenance",
                categoryColor: "#4CAF50",
                budgeted: 1000.0,
                actual: 550.0,
                remaining: 450.0,
                percentage: 55,
              },
            ],
            totals: {
              budgeted: 5000.0,
              actual: 3250.75,
              remaining: 1749.25,
              percentage: 65,
            },
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch budget summary");
        setIsLoading(false);
      }
    };

    fetchBudgetSummary();
  }, [year]);

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleExport = (format) => {
    alert(`Exporting budget summary as ${format}`);
  };

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
            <FaWallet className="mr-2" /> Budget Summary Report
          </h1>
          <p className="text-gray-600">
            API Endpoint: <code>/api/v1/budgets/summary</code>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={year}
            onChange={handleYearChange}
            className="px-3 py-2 border rounded-md"
          >
            {[2021, 2022, 2023, 2024].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleExport("pdf")}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center"
          >
            <FaFileExport className="mr-2" /> PDF
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center"
          >
            <FaFileExport className="mr-2" /> CSV
          </button>
        </div>
      </div>

      {summaryData && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm text-gray-500">Total Budgeted</p>
              <p className="text-xl font-bold text-blue-600">
                CHF {summaryData.totals.budgeted.toFixed(2)}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm text-gray-500">Total Actual</p>
              <p className="text-xl font-bold text-green-600">
                CHF {summaryData.totals.actual.toFixed(2)}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm text-gray-500">Total Remaining</p>
              <p className="text-xl font-bold text-purple-600">
                CHF {summaryData.totals.remaining.toFixed(2)}
              </p>
            </div>
            <div className="bg-white shadow rounded-md p-4">
              <p className="text-sm text-gray-500">Usage Percentage</p>
              <p className="text-xl font-bold text-orange-600">
                {summaryData.totals.percentage}%
              </p>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white shadow rounded-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Period</th>
                    <th className="border px-4 py-2 text-right">Budgeted</th>
                    <th className="border px-4 py-2 text-right">Actual</th>
                    <th className="border px-4 py-2 text-right">Remaining</th>
                    <th className="border px-4 py-2 text-right">Expenses</th>
                    <th className="border px-4 py-2 text-right">Usage %</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.monthly.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{month.periodName}</td>
                      <td className="border px-4 py-2 text-right">
                        CHF {month.budgeted.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        CHF {month.actual.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        CHF {month.remaining.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {month.count}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs ${
                            month.percentage > 90
                              ? "bg-red-500"
                              : month.percentage > 75
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                        >
                          {month.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="bg-white shadow rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Category</th>
                    <th className="border px-4 py-2 text-right">Budgeted</th>
                    <th className="border px-4 py-2 text-right">Actual</th>
                    <th className="border px-4 py-2 text-right">Remaining</th>
                    <th className="border px-4 py-2 text-right">Usage %</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.categories.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.categoryColor }}
                          ></div>
                          {category.categoryName}
                        </div>
                      </td>
                      <td className="border px-4 py-2 text-right">
                        CHF {category.budgeted.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        CHF {category.actual.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        CHF {category.remaining.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${category.percentage}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                category.percentage > 90
                                  ? "bg-red-500"
                                  : category.percentage > 75
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold inline-block mt-1">
                            {category.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetSummaryReport;
