import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import API from "../../api/apiConfig";
import { motion } from "framer-motion";

const AllBudgetsReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [sortField, setSortField] = useState("-year,-month");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await API.get(
          `/budgets?sort=${sortField}&page=${pagination.page}&limit=${pagination.limit}`
        );

        if (response.data && response.data.success) {
          console.log("Budget data:", response.data);
          setBudgets(response.data.data || []);

          // Set pagination based on the response
          setPagination({
            page: pagination.page,
            limit: pagination.limit,
            total: response.data.count || 0,
            hasNext: response.data.pagination?.next !== undefined,
            hasPrev: pagination.page > 1,
          });
        } else {
          setError("Failed to fetch budget data");
          setBudgets([]);
        }
      } catch (err) {
        console.error("Error fetching budgets:", err);
        setError(err.response?.data?.message || "Failed to fetch budgets");
        setBudgets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, [sortField, pagination.page, pagination.limit]);

  const handleSort = (field) => {
    // Convert field to proper sort parameter
    let newSortField = field;

    if (field === sortField.replace("-", "")) {
      // Toggle direction
      newSortField = sortField.startsWith("-")
        ? field // Change to ascending
        : `-${field}`; // Change to descending
    } else if (field === "period") {
      // Special case for period - sort by year and month
      newSortField = sortField.includes("-year")
        ? "year,month" // Ascending
        : "-year,-month"; // Descending
    } else {
      // New field, default to descending
      newSortField = `-${field}`;
    }

    setSortField(newSortField);
    setSortDirection(newSortField.startsWith("-") ? "desc" : "asc");
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleExport = (format) => {
    // Simple placeholder for export functionality
    const fileName = `budget-report-${new Date().toISOString().split("T")[0]}`;

    if (format === "csv") {
      const csvContent = generateCSVContent();
      downloadCSV(csvContent, `${fileName}.csv`);
    } else {
      alert(`Exporting as ${format} is not implemented yet.`);
    }
  };

  // Helper function to generate CSV content
  const generateCSVContent = () => {
    // Create CSV header
    let csvContent =
      "Period,Category,Budget (CHF),Actual (CHF),Remaining (CHF),Expenses Count,Usage %,Status\n";

    // Add rows for each budget
    budgets.forEach((budget) => {
      const row = [
        budget.periodName || `${budget.month}/${budget.year}`,
        budget.category?.name || "N/A",
        budget.amount?.toFixed(2) || "0.00",
        budget.usage?.totalCost?.toFixed(2) || "0.00",
        budget.usage?.remaining?.toFixed(2) ||
          budget.amount?.toFixed(2) ||
          "0.00",
        budget.usage?.totalExpenses || 0,
        budget.usage?.usagePercentage || 0,
        budget.usage?.status?.toUpperCase() || "N/A",
      ].join(",");

      csvContent += row + "\n";
    });

    return csvContent;
  };

  // Helper function to download CSV
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading && budgets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d348b]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaMoneyBillWave className="mr-2 text-[#7678ed]" />
            All Budgets Report
          </h1>
          <p className="text-gray-600">
            Comprehensive overview of all budget allocations and usage
          </p>
        </motion.div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport("pdf")}
            className="flex items-center px-3 py-2 bg-gradient-to-r from-[#3d348b] to-[#7678ed] text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-sm"
          >
            <FaFileExport className="mr-2" />
            Export PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport("csv")}
            className="flex items-center px-3 py-2 bg-gradient-to-r from-[#f7b801] to-[#f35b04] text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-sm"
          >
            <FaFileExport className="mr-2" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <motion.div
        className="bg-white shadow-lg rounded-lg overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center font-semibold"
                    onClick={() => handleSort("period")}
                  >
                    Period
                    {sortField.includes("year") &&
                      (sortField.includes("-year") ? (
                        <FaSortAmountDown className="ml-1" size={12} />
                      ) : (
                        <FaSortAmountUp className="ml-1" size={12} />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center font-semibold ml-auto"
                    onClick={() => handleSort("amount")}
                  >
                    Budget
                    {sortField.includes("amount") &&
                      (sortField.includes("-amount") ? (
                        <FaSortAmountDown className="ml-1" size={12} />
                      ) : (
                        <FaSortAmountUp className="ml-1" size={12} />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center font-semibold ml-auto"
                    onClick={() => handleSort("usage.totalCost")}
                  >
                    Actual
                    {sortField.includes("usage.totalCost") &&
                      (sortField.includes("-usage.totalCost") ? (
                        <FaSortAmountDown className="ml-1" size={12} />
                      ) : (
                        <FaSortAmountUp className="ml-1" size={12} />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center font-semibold ml-auto"
                    onClick={() => handleSort("usage.usagePercentage")}
                  >
                    Usage %
                    {sortField.includes("usage.usagePercentage") &&
                      (sortField.includes("-usage.usagePercentage") ? (
                        <FaSortAmountDown className="ml-1" size={12} />
                      ) : (
                        <FaSortAmountUp className="ml-1" size={12} />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No budget data available
                  </td>
                </tr>
              ) : (
                budgets.map((budget, index) => (
                  <motion.tr
                    key={budget._id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {budget.periodName || `${budget.month}/${budget.year}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: budget.category?.color || "#999",
                          }}
                        ></div>
                        {budget.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap font-medium">
                      CHF {budget.amount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-green-600 font-medium">
                      CHF {budget.usage?.totalCost?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-blue-600">
                      CHF{" "}
                      {budget.usage?.remaining?.toFixed(2) ||
                        budget.amount?.toFixed(2) ||
                        "0.00"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {budget.usage?.totalExpenses || 0}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{
                              width: `${budget.usage?.usagePercentage || 0}%`,
                            }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              (budget.usage?.usagePercentage || 0) >=
                              budget.criticalThreshold
                                ? "bg-red-500"
                                : (budget.usage?.usagePercentage || 0) >=
                                  budget.warningThreshold
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold inline-block mt-1">
                          {budget.usage?.usagePercentage || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs ${
                          budget.usage?.status === "over"
                            ? "bg-red-500"
                            : budget.usage?.status === "warning"
                            ? "bg-yellow-500"
                            : budget.usage?.status === "under"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {budget.usage?.status?.toUpperCase() || "N/A"}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.total > pagination.limit && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                budgets
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className={`flex items-center px-3 py-1 rounded-md ${
                  !pagination.hasPrev
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaChevronLeft className="mr-1" size={12} /> Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className={`flex items-center px-3 py-1 rounded-md ${
                  !pagination.hasNext
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next <FaChevronRight className="ml-1" size={12} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AllBudgetsReport;
