import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTimePeriodSummary } from "../../../api/analyticsApi";
import ExpenseChart from "../../../components/charts/ExpenseChart";
import AnalyticsNav from "../../../components/analytics/AnalyticsNav";

const TimeSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodSummary, setPeriodSummary] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [periodType, setPeriodType] = useState("month");

  // Fetch time period summary data
  useEffect(() => {
    const fetchPeriodSummary = async () => {
      try {
        setLoading(true);
        const response = await getTimePeriodSummary({
          periodType,
          year: selectedYear,
        });
        setPeriodSummary(response.data);
      } catch (err) {
        setError("Failed to load period summary data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodSummary();
  }, [periodType, selectedYear]);

  // Handle period type change
  const handlePeriodTypeChange = (e) => {
    setPeriodType(e.target.value);
  };

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Navigate to period detail
  const navigateToPeriodDetail = (period) => {
    navigate(
      `/admin/analytics/period/${periodType}/${period.period}/${selectedYear}`
    );
  };

  // Prepare chart data for period summary
  const preparePeriodSummaryChart = () => {
    if (!periodSummary) return null;

    const labels = periodSummary.summary.map((item) => item.periodLabel);
    const costData = periodSummary.summary.map((item) => item.totalCost);
    const distanceData = periodSummary.summary.map(
      (item) => item.totalDistance
    );

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
          label: "Total Distance (km)",
          data: distanceData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          yAxisID: "y1",
        },
      ],
    };
  };

  // Prepare chart options for period summary
  const periodSummaryChartOptions = {
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
          text: "Distance (km)",
        },
      },
    },
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Time Period Summary</h1>

      <AnalyticsNav activeTab="time-summary" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Expense Summary by Period</h2>
          <div className="flex space-x-4">
            <select
              value={periodType}
              onChange={handlePeriodTypeChange}
              className="border rounded p-2"
            >
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
              <option value="year">Yearly</option>
            </select>

            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border rounded p-2"
            >
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
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
        ) : periodSummary ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Total Expenses</h3>
                <p className="text-2xl font-bold">
                  {periodSummary.totals.totalExpenses}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Total Distance</h3>
                <p className="text-2xl font-bold">
                  {periodSummary.totals.totalDistance.toFixed(1)} km
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Total Cost</h3>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("de-CH", {
                    style: "currency",
                    currency: "CHF",
                  }).format(periodSummary.totals.totalCost)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">
                  Average Cost per Expense
                </h3>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("de-CH", {
                    style: "currency",
                    currency: "CHF",
                  }).format(periodSummary.totals.avgCost)}
                </p>
              </div>
            </div>

            <div className="h-80">
              <ExpenseChart
                chartType="bar"
                data={preparePeriodSummaryChart()}
                options={periodSummaryChartOptions}
                height={300}
              />
            </div>

            {/* Period Summary Table with Links to Detail */}
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {periodSummary.summary.map((period) => (
                    <tr
                      key={`${period.period}-${period.year}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {period.periodLabel}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {period.totalExpenses}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {period.totalDistance.toFixed(1)} km
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Intl.NumberFormat("de-CH", {
                            style: "currency",
                            currency: "CHF",
                          }).format(period.totalCost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Intl.NumberFormat("de-CH", {
                            style: "currency",
                            currency: "CHF",
                          }).format(period.avgCost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigateToPeriodDetail(period)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
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

export default TimeSummary;
