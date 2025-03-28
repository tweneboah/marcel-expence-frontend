import { useState, useEffect } from "react";
import { getYearlyComparison } from "../../../api/analyticsApi";
import ExpenseChart from "../../../components/charts/ExpenseChart";
import AnalyticsNav from "../../../components/analytics/AnalyticsNav";

const YearlyComparison = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [compareYears, setCompareYears] = useState([
    2024, // Use 2024 as first year
    2025, // Use 2025 as second year (where most expenses are)
  ]);

  // Fetch yearly comparison data
  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        setLoading(true);
        const response = await getYearlyComparison({
          year1: compareYears[0],
          year2: compareYears[1],
        });
        setYearlyData(response.data);
      } catch (err) {
        setError("Failed to load yearly comparison data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyData();
  }, [compareYears]);

  // Handle comparison years change
  const handleCompareYearChange = (index, value) => {
    const newYears = [...compareYears];
    newYears[index] = parseInt(value);
    setCompareYears(newYears);
  };

  // Prepare chart data for yearly comparison
  const prepareYearlyComparisonChart = () => {
    if (!yearlyData) return null;

    const labels = yearlyData.monthNames;
    const year1Data = Array(12).fill(0);
    const year2Data = Array(12).fill(0);

    // Populate data for each month
    yearlyData.year1.months.forEach((month) => {
      year1Data[month.month - 1] = month.totalCost;
    });

    yearlyData.year2.months.forEach((month) => {
      year2Data[month.month - 1] = month.totalCost;
    });

    return {
      labels,
      datasets: [
        {
          label: `${yearlyData.year1.year} (CHF)`,
          data: year1Data,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
        {
          label: `${yearlyData.year2.year} (CHF)`,
          data: year2Data,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgb(53, 162, 235)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate years for select dropdowns
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= 2025; i++) {
      years.push(i);
    }
    return years;
  };

  // Prepare expense count chart
  const prepareExpenseCountChart = () => {
    if (!yearlyData) return null;

    const labels = yearlyData.monthNames;
    const year1Data = Array(12).fill(0);
    const year2Data = Array(12).fill(0);

    // Populate data for each month
    yearlyData.year1.months.forEach((month) => {
      year1Data[month.month - 1] = month.totalExpenses;
    });

    yearlyData.year2.months.forEach((month) => {
      year2Data[month.month - 1] = month.totalExpenses;
    });

    return {
      labels,
      datasets: [
        {
          label: `${yearlyData.year1.year} (Count)`,
          data: year1Data,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
        {
          label: `${yearlyData.year2.year} (Count)`,
          data: year2Data,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgb(53, 162, 235)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Yearly Comparison</h1>

      <AnalyticsNav activeTab="yearly-comparison" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Expense Yearly Comparison</h2>
          <div className="flex space-x-4">
            <select
              value={compareYears[0]}
              onChange={(e) => handleCompareYearChange(0, e.target.value)}
              className="border rounded p-2"
            >
              {generateYearOptions().map((year) => (
                <option key={`year1-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <span className="self-center">vs</span>
            <select
              value={compareYears[1]}
              onChange={(e) => handleCompareYearChange(1, e.target.value)}
              className="border rounded p-2"
            >
              {generateYearOptions().map((year) => (
                <option key={`year2-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : yearlyData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Change in Expenses</h3>
                <p
                  className={`text-2xl font-bold ${
                    yearlyData.changes.totalExpenses >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {yearlyData.changes.totalExpenses >= 0 ? "+" : ""}
                  {yearlyData.changes.totalExpenses.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Change in Distance</h3>
                <p
                  className={`text-2xl font-bold ${
                    yearlyData.changes.totalDistance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {yearlyData.changes.totalDistance >= 0 ? "+" : ""}
                  {yearlyData.changes.totalDistance.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Change in Cost</h3>
                <p
                  className={`text-2xl font-bold ${
                    yearlyData.changes.totalCost >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {yearlyData.changes.totalCost >= 0 ? "+" : ""}
                  {yearlyData.changes.totalCost.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Cost Comparison
              </h3>
              <div className="h-80">
                <ExpenseChart
                  chartType="bar"
                  data={prepareYearlyComparisonChart()}
                  height={300}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Expense Count Comparison
              </h3>
              <div className="h-80">
                <ExpenseChart
                  chartType="bar"
                  data={prepareExpenseCountChart()}
                  height={300}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">
                  {yearlyData.year1.year} Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Expenses:</span>
                    <span className="font-medium">
                      {yearlyData.year1.totals.totalExpenses}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Distance:</span>
                    <span className="font-medium">
                      {yearlyData.year1.totals.totalDistance.toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Cost:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("de-CH", {
                        style: "currency",
                        currency: "CHF",
                      }).format(yearlyData.year1.totals.totalCost)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">
                  {yearlyData.year2.year} Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Expenses:</span>
                    <span className="font-medium">
                      {yearlyData.year2.totals.totalExpenses}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Distance:</span>
                    <span className="font-medium">
                      {yearlyData.year2.totals.totalDistance.toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Cost:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("de-CH", {
                        style: "currency",
                        currency: "CHF",
                      }).format(yearlyData.year2.totals.totalCost)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlyComparison;
