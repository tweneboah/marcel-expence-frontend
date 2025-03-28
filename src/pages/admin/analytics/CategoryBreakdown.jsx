import { useState, useEffect } from "react";
import { getCategoryBreakdown } from "../../../api/analyticsApi";
import ExpenseChart from "../../../components/charts/ExpenseChart";
import AnalyticsNav from "../../../components/analytics/AnalyticsNav";

const CategoryBreakdown = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  });

  // Fetch category breakdown data
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await getCategoryBreakdown({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        setCategoryData(response.data);
      } catch (err) {
        setError("Failed to load category breakdown data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Prepare chart data for category breakdown
  const prepareCategoryChart = () => {
    if (!categoryData) return null;

    const labels = categoryData.categories.map((cat) => cat.categoryName);
    const costData = categoryData.categories.map((cat) => cat.totalCost);
    const colors = categoryData.categories.map(
      (cat) =>
        cat.categoryColor ||
        `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );

    return {
      labels,
      datasets: [
        {
          label: "Total Cost by Category (CHF)",
          data: costData,
          backgroundColor: colors,
          borderColor: colors.map((color) => color),
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Category Breakdown</h1>

      <AnalyticsNav activeTab="category-breakdown" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Expense Breakdown by Category
          </h2>
          <div className="flex space-x-4">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                handleDateRangeChange("startDate", e.target.value)
              }
              className="border rounded p-2"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : categoryData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Total Categories</h3>
                <p className="text-2xl font-bold">
                  {categoryData.totals.totalCategories}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Total Expenses</h3>
                <p className="text-2xl font-bold">
                  {categoryData.totals.totalExpenses}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500">Total Cost</h3>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("de-CH", {
                    style: "currency",
                    currency: "CHF",
                  }).format(categoryData.totals.totalCost)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-80">
                <ExpenseChart
                  chartType="doughnut"
                  data={prepareCategoryChart()}
                  height={300}
                />
              </div>

              <div className="overflow-auto max-h-80">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expenses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryData.categories.map((category) => (
                      <tr key={category.categoryId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 mr-2 rounded-full"
                              style={{
                                backgroundColor: category.categoryColor,
                              }}
                            ></div>
                            <div className="text-sm font-medium text-gray-900">
                              {category.categoryName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.totalExpenses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat("de-CH", {
                            style: "currency",
                            currency: "CHF",
                          }).format(category.totalCost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.percentageOfTotalCost.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Stats Section */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Additional Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryData.categories.map((category) => (
                  <div
                    key={`stats-${category.categoryId}`}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center mb-2">
                      <div
                        className="w-3 h-3 mr-2 rounded-full"
                        style={{
                          backgroundColor: category.categoryColor,
                        }}
                      ></div>
                      <h4 className="text-sm font-medium">
                        {category.categoryName}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Avg Distance:</span>
                        <p className="font-medium">
                          {category.avgDistance.toFixed(1)} km
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Cost:</span>
                        <p className="font-medium">
                          {new Intl.NumberFormat("de-CH", {
                            style: "currency",
                            currency: "CHF",
                          }).format(category.avgCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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

export default CategoryBreakdown;
