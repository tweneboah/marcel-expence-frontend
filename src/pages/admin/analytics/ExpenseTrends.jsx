import { useState, useEffect } from "react";
import { getExpenseTrends } from "../../../api/analyticsApi";
import ExpenseChart from "../../../components/charts/ExpenseChart";
import AnalyticsNav from "../../../components/analytics/AnalyticsNav";

const ExpenseTrends = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [periodType, setPeriodType] = useState("month");
  const [months, setMonths] = useState(6);
  const [targetYear, setTargetYear] = useState(2025);

  // Fetch expense trends data
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        const response = await getExpenseTrends({
          periodType,
          months,
          targetYear,
        });
        setTrendData(response.data);
      } catch (err) {
        setError("Failed to load expense trends data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [periodType, months, targetYear]);

  // Handle period type change
  const handlePeriodTypeChange = (e) => {
    setPeriodType(e.target.value);
  };

  // Handle months change
  const handleMonthsChange = (e) => {
    setMonths(parseInt(e.target.value));
  };

  // Handle target year change
  const handleTargetYearChange = (e) => {
    setTargetYear(parseInt(e.target.value));
  };

  // Prepare chart data for expense trends
  const prepareTrendChart = () => {
    if (!trendData) return null;

    const labels = trendData.trends.map((item) => item.dateString);
    const costData = trendData.trends.map((item) => item.totalCost);
    const countData = trendData.trends.map((item) => item.totalExpenses);
    const ma3Data = trendData.movingAverages?.ma3 || [];

    return {
      labels,
      datasets: [
        {
          label: "Total Cost (CHF)",
          data: costData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "y",
        },
        {
          label: "Expense Count",
          data: countData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y1",
        },
        {
          label: "3-Month Moving Average (CHF)",
          data: ma3Data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderDash: [5, 5],
          yAxisID: "y",
          pointRadius: 0,
        },
      ],
    };
  };

  // Prepare chart options for trends
  const trendChartOptions = {
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Cost (CHF)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  // Get period name
  const getPeriodName = (periodType) => {
    switch (periodType) {
      case "day":
        return "Daily";
      case "week":
        return "Weekly";
      case "month":
        return "Monthly";
      default:
        return "Monthly";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Expense Trends</h1>

      <AnalyticsNav activeTab="trends" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Expense Trend Analysis</h2>
          <div className="flex space-x-4">
            <select
              value={periodType}
              onChange={handlePeriodTypeChange}
              className="border rounded p-2"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>

            <select
              value={months}
              onChange={handleMonthsChange}
              className="border rounded p-2"
            >
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
              <option value="24">Last 24 Months</option>
            </select>

            <select
              value={targetYear}
              onChange={handleTargetYearChange}
              className="border rounded p-2"
            >
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : trendData ? (
          <>
            <div className="mb-6">
              <p className="text-gray-500">
                Viewing {getPeriodName(periodType)} expense trends for the last{" "}
                {months} month{months !== 1 ? "s" : ""}
                {trendData.dateRange && (
                  <span className="ml-2">
                    (
                    {new Date(trendData.dateRange.startDate).toLocaleDateString(
                      "de-CH"
                    )}{" "}
                    -{" "}
                    {new Date(trendData.dateRange.endDate).toLocaleDateString(
                      "de-CH"
                    )}
                    )
                  </span>
                )}
              </p>
            </div>

            <div className="h-80 mb-6">
              <ExpenseChart
                chartType="line"
                data={prepareTrendChart()}
                options={trendChartOptions}
                height={300}
              />
            </div>

            {/* Trend Data Table */}
            <div className="overflow-x-auto mt-8">
              <h3 className="text-lg font-semibold mb-4">Trend Data</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Distance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    {trendData.movingAverages?.ma3 && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        3-Month MA
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trendData.trends.map((trend, index) => (
                    <tr key={trend.dateString} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {trend.dateString}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {trend.totalExpenses}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {trend.totalDistance.toFixed(1)} km
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Intl.NumberFormat("de-CH", {
                            style: "currency",
                            currency: "CHF",
                          }).format(trend.totalCost)}
                        </div>
                      </td>
                      {trendData.movingAverages?.ma3 && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {trendData.movingAverages.ma3[index]
                              ? new Intl.NumberFormat("de-CH", {
                                  style: "currency",
                                  currency: "CHF",
                                }).format(trendData.movingAverages.ma3[index])
                              : "-"}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default ExpenseTrends;
