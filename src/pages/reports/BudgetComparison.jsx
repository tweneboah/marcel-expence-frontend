import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../api/apiConfig";
import { BASE_URL } from "../../api/apiConfig";
import { FaChartBar, FaFileExport, FaCalendarAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BudgetComparison = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarters, setQuarters] = useState(["Q1", "Q2", "Q3", "Q4"]);
  const [selectedQuarter, setSelectedQuarter] = useState("all");

  useEffect(() => {
    const fetchComparisonData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use API instance with auth headers instead of direct axios request
        const response = await API.get(
          `/advanced-reports/budget-comparison?year=${year}&quarter=${selectedQuarter}`
        );
        setComparisonData(response.data.data);
        setIsLoading(false);

        // Comment out mock data
        // setTimeout(() => {
        //   const mockData = getMockData(year, selectedQuarter);
        //   setComparisonData(mockData);
        //   setIsLoading(false);
        // }, 1000);
      } catch (err) {
        console.error("Error fetching budget comparison data:", err);
        setError(
          "Failed to load budget comparison data. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchComparisonData();
  }, [year, selectedQuarter]);

  const getMockData = (year, selectedQuarter) => {
    // Generate data based on quarter selection
    let labels;
    let datasets;
    let periodSpecificSummary;

    const periodLabel = selectedQuarter === "all" ? "Year" : selectedQuarter;

    if (selectedQuarter === "all") {
      // Yearly view showing all quarters
      labels = ["Q1", "Q2", "Q3", "Q4"];

      datasets = [
        {
          label: "Budget",
          data: [1200, 1500, 1300, 1400],
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Actual",
          data: [1100, 1600, 1200, 1350],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ];

      periodSpecificSummary = {
        totalBudget: 5400,
        totalActual: 5250,
        variance: -150,
        variancePercentage: -2.78,
        status: "under",
      };
    } else {
      // Specific quarter view showing months
      const quarterIndex = parseInt(selectedQuarter.charAt(1)) - 1;
      const monthsInQuarter = [
        ["January", "February", "March"],
        ["April", "May", "June"],
        ["July", "August", "September"],
        ["October", "November", "December"],
      ][quarterIndex];

      labels = monthsInQuarter;

      // Generate more detailed data for the specific quarter
      const budgetData =
        quarterIndex === 0
          ? [400, 380, 420]
          : quarterIndex === 1
          ? [500, 470, 530]
          : quarterIndex === 2
          ? [430, 410, 460]
          : [480, 450, 470];

      const actualData =
        quarterIndex === 0
          ? [380, 390, 330]
          : quarterIndex === 1
          ? [520, 510, 570]
          : quarterIndex === 2
          ? [420, 380, 400]
          : [460, 420, 470];

      datasets = [
        {
          label: "Budget",
          data: budgetData,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Actual",
          data: actualData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ];

      const totalBudget = budgetData.reduce((sum, val) => sum + val, 0);
      const totalActual = actualData.reduce((sum, val) => sum + val, 0);
      const variance = totalActual - totalBudget;
      const variancePercentage = (variance / totalBudget) * 100;

      periodSpecificSummary = {
        totalBudget,
        totalActual,
        variance,
        variancePercentage,
        status: variance > 0 ? "over" : variance < 0 ? "under" : "on-target",
      };
    }

    // Category breakdown data
    const categoryBreakdown = [
      {
        category: "Fuel",
        budget: 2700,
        actual: 2835,
        variance: 135,
        variancePercentage: 5.0,
        status: "over",
      },
      {
        category: "Tolls",
        budget: 1350,
        actual: 1215,
        variance: -135,
        variancePercentage: -10.0,
        status: "under",
      },
      {
        category: "Maintenance",
        budget: 1350,
        actual: 1200,
        variance: -150,
        variancePercentage: -11.11,
        status: "under",
      },
    ];

    // Detailed metrics for the dashboard
    const detailedMetrics = {
      largestOverBudgetCategory: "Fuel",
      largestOverBudgetAmount: 135,
      largestUnderBudgetCategory: "Maintenance",
      largestUnderBudgetAmount: 150,
      averageVariancePercentage: -2.78,
      budgetUtilizationRate: 97.22,
      mostExpensiveCategory: "Fuel",
      leastExpensiveCategory: "Maintenance",
    };

    return {
      chartData: {
        labels,
        datasets,
      },
      periodLabel,
      summary: {
        year,
        periodSpecificSummary,
        categoryBreakdown,
        detailedMetrics,
      },
    };
  };

  const getChartOptions = () => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Budget vs. Actual (${year} ${comparisonData?.periodLabel})`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount (CHF)",
          },
        },
      },
    };
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleQuarterChange = (e) => {
    setSelectedQuarter(e.target.value);
  };

  const handleExport = (format) => {
    alert(`Exporting budget comparison data as ${format}`);
  };

  const getStatusColor = (status) => {
    return status === "over"
      ? "text-red-600"
      : status === "under"
      ? "text-green-600"
      : "text-yellow-600";
  };

  const getStatusBgColor = (status) => {
    return status === "over"
      ? "bg-red-50"
      : status === "under"
      ? "bg-green-50"
      : "bg-yellow-50";
  };

  const getStatusLabel = (status) => {
    return status === "over"
      ? "Over Budget"
      : status === "under"
      ? "Under Budget"
      : "On Target";
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
            <FaChartBar className="mr-2" /> Budget Comparison
          </h1>
          <p className="text-gray-600">
            API Endpoint:{" "}
            <code>/api/v1/advanced-reports/budget-comparison</code>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <FaFileExport className="mr-2" /> Export PDF
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <FaFileExport className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <span className="font-medium">Year:</span>
            <select
              value={year}
              onChange={handleYearChange}
              className="border rounded-md px-3 py-1"
            >
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
              <option value={2021}>2021</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium">Quarter:</span>
            <select
              value={selectedQuarter}
              onChange={handleQuarterChange}
              className="border rounded-md px-3 py-1"
            >
              <option value="all">All Quarters</option>
              {quarters.map((quarter, index) => (
                <option key={index} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-80">
          {comparisonData && (
            <Bar data={comparisonData.chartData} options={getChartOptions()} />
          )}
        </div>
      </div>

      {comparisonData && comparisonData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Period Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-600">Total Budget</div>
                <div className="text-xl font-medium">
                  CHF{" "}
                  {comparisonData.summary.periodSpecificSummary.totalBudget.toFixed(
                    2
                  )}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-md">
                <div className="text-sm text-purple-600">Total Actual</div>
                <div className="text-xl font-medium">
                  CHF{" "}
                  {comparisonData.summary.periodSpecificSummary.totalActual.toFixed(
                    2
                  )}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600">Variance</div>
                <div
                  className={`text-xl font-medium ${
                    comparisonData.summary.periodSpecificSummary.variance > 0
                      ? "text-red-600"
                      : comparisonData.summary.periodSpecificSummary.variance <
                        0
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  CHF{" "}
                  {comparisonData.summary.periodSpecificSummary.variance.toFixed(
                    2
                  )}
                </div>
              </div>
              <div
                className={`p-4 rounded-md ${getStatusBgColor(
                  comparisonData.summary.periodSpecificSummary.status
                )}`}
              >
                <div
                  className={`text-sm ${getStatusColor(
                    comparisonData.summary.periodSpecificSummary.status
                  )}`}
                >
                  Status
                </div>
                <div
                  className={`text-xl font-medium ${getStatusColor(
                    comparisonData.summary.periodSpecificSummary.status
                  )}`}
                >
                  {getStatusLabel(
                    comparisonData.summary.periodSpecificSummary.status
                  )}
                  (
                  {comparisonData.summary.periodSpecificSummary.variancePercentage.toFixed(
                    2
                  )}
                  %)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Key Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-md">
                <div className="text-sm text-red-600">Largest Over Budget</div>
                <div className="text-xl font-medium text-red-600">
                  {
                    comparisonData.summary.detailedMetrics
                      .largestOverBudgetCategory
                  }
                </div>
                <div className="text-gray-600">
                  CHF{" "}
                  {comparisonData.summary.detailedMetrics.largestOverBudgetAmount.toFixed(
                    2
                  )}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-md">
                <div className="text-sm text-green-600">
                  Largest Under Budget
                </div>
                <div className="text-xl font-medium text-green-600">
                  {
                    comparisonData.summary.detailedMetrics
                      .largestUnderBudgetCategory
                  }
                </div>
                <div className="text-gray-600">
                  CHF{" "}
                  {comparisonData.summary.detailedMetrics.largestUnderBudgetAmount.toFixed(
                    2
                  )}
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-md">
                <div className="text-sm text-yellow-600">
                  Budget Utilization
                </div>
                <div className="text-xl font-medium text-yellow-600">
                  {comparisonData.summary.detailedMetrics.budgetUtilizationRate.toFixed(
                    2
                  )}
                  %
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-600">Avg. Variance</div>
                <div
                  className={`text-xl font-medium ${
                    comparisonData.summary.detailedMetrics
                      .averageVariancePercentage > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {comparisonData.summary.detailedMetrics.averageVariancePercentage.toFixed(
                    2
                  )}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {comparisonData && comparisonData.summary && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Category Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Budget (CHF)</th>
                  <th className="px-4 py-2 text-right">Actual (CHF)</th>
                  <th className="px-4 py-2 text-right">Variance (CHF)</th>
                  <th className="px-4 py-2 text-right">Variance (%)</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comparisonData.summary.categoryBreakdown.map(
                  (category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {category.category}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {category.budget.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {category.actual.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right ${
                          category.variance > 0
                            ? "text-red-600"
                            : category.variance < 0
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {category.variance.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right ${
                          category.variancePercentage > 0
                            ? "text-red-600"
                            : category.variancePercentage < 0
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {category.variancePercentage.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                            category.status === "over"
                              ? "bg-red-500"
                              : category.status === "under"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {getStatusLabel(category.status)}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right">
                    CHF{" "}
                    {comparisonData.summary.periodSpecificSummary.totalBudget.toFixed(
                      2
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    CHF{" "}
                    {comparisonData.summary.periodSpecificSummary.totalActual.toFixed(
                      2
                    )}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      comparisonData.summary.periodSpecificSummary.variance > 0
                        ? "text-red-600"
                        : comparisonData.summary.periodSpecificSummary
                            .variance < 0
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    CHF{" "}
                    {comparisonData.summary.periodSpecificSummary.variance.toFixed(
                      2
                    )}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      comparisonData.summary.periodSpecificSummary
                        .variancePercentage > 0
                        ? "text-red-600"
                        : comparisonData.summary.periodSpecificSummary
                            .variancePercentage < 0
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {comparisonData.summary.periodSpecificSummary.variancePercentage.toFixed(
                      2
                    )}
                    %
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                        comparisonData.summary.periodSpecificSummary.status ===
                        "over"
                          ? "bg-red-500"
                          : comparisonData.summary.periodSpecificSummary
                              .status === "under"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {getStatusLabel(
                        comparisonData.summary.periodSpecificSummary.status
                      )}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetComparison;
