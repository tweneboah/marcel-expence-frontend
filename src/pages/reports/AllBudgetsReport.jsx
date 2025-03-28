import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
import API from "../../api/apiConfig";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AllBudgetsReport = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: 0, // 0 means all months
    isActive: true,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [sortField, setSortField] = useState("-year,-month");
  const [sortDirection, setSortDirection] = useState("desc");

  const monthNames = [
    "All Months",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build query params based on filters
        let queryParams = `sort=${sortField}&page=${pagination.page}&limit=${pagination.limit}`;

        if (filters.year) {
          queryParams += `&year=${filters.year}`;
        }

        if (filters.month > 0) {
          queryParams += `&month=${filters.month}`;
        }

        if (filters.isActive !== null) {
          queryParams += `&isActive=${filters.isActive}`;
        }

        console.log("Fetching budgets with params:", queryParams);
        const response = await API.get(`/budgets?${queryParams}`);
        console.log("API Response:", response);

        if (response.data && response.data.data) {
          // Check if response.data.data is an array, if not, wrap it in an array if it exists
          const budgetsData = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];

          console.log(`Processed ${budgetsData.length} budgets:`, budgetsData);
          setBudgets(budgetsData);

          // Set pagination based on the response
          setPagination({
            page: pagination.page,
            limit: pagination.limit,
            total: response.data.count || 0,
            hasNext: response.data.pagination?.next !== undefined,
            hasPrev: pagination.page > 1,
          });
          setError(null);
        } else {
          console.error("No data in response:", response);
          setBudgets([]);
          setError("No budget data received from server");
        }
      } catch (err) {
        console.error("Error fetching budgets:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        });
        setError(err.response?.data?.message || "Failed to fetch budgets");
        setBudgets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, [sortField, pagination.page, pagination.limit, filters]);

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

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
    // Reset to first page when changing filters
    setPagination({ ...pagination, page: 1 });
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
      "Period,Category,Budget (CHF),Actual (CHF),Remaining (CHF),Expenses Count,Total Distance,Usage %,Status\n";

    // Add rows for each budget
    budgets.forEach((budget) => {
      const row = [
        budget.periodLabel || `${budget.month}/${budget.year}`,
        budget.category?.name || "N/A",
        budget.amount?.toFixed(2) || "0.00",
        budget.usage?.actualCost?.toFixed(2) || "0.00",
        budget.usage?.remainingAmount?.toFixed(2) ||
          budget.remainingAmount?.toFixed(2) ||
          budget.amount?.toFixed(2) ||
          "0.00",
        budget.usage?.expenseCount || 0,
        budget.usage?.actualDistance?.toFixed(2) || "0.00",
        (budget.usage?.usagePercentage || budget.usagePercentage || 0).toFixed(
          1
        ),
        (budget.status || "UNDER").toUpperCase(),
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

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d348b] mb-4"></div>
        <p className="text-gray-600">Loading budgets data...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8"
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
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:shadow-lg transition-all duration-300 shadow-sm"
          >
            <FaFilter className="mr-2 text-[#3d348b]" />
            Filters
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

      {filterOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-md p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <div className="relative">
                <select
                  value={filters.year}
                  onChange={(e) =>
                    handleFilterChange(
                      "year",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#7678ed] focus:border-[#7678ed] rounded-md"
                >
                  <option value="">All Years</option>
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <div className="relative">
                <select
                  value={filters.month}
                  onChange={(e) =>
                    handleFilterChange("month", parseInt(e.target.value))
                  }
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#7678ed] focus:border-[#7678ed] rounded-md"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  value={
                    filters.isActive === null ? "" : filters.isActive.toString()
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange(
                      "isActive",
                      value === "" ? null : value === "true"
                    );
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#7678ed] focus:border-[#7678ed] rounded-md"
                >
                  <option value="">All Budgets</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setFilters({
                  year: new Date().getFullYear(),
                  month: 0,
                  isActive: true,
                });
                setPagination({ ...pagination, page: 1 });
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors mr-2"
            >
              Reset
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="bg-[#3d348b] text-white px-4 py-2 rounded-md hover:bg-[#7678ed] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
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
                    onClick={() => handleSort("usage.actualCost")}
                  >
                    Actual
                    {sortField.includes("usage.actualCost") &&
                      (sortField.includes("-usage.actualCost") ? (
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
                  Distance
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
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FaMoneyBillWave className="text-4xl text-gray-300 mb-3" />
                      <p className="text-lg">No budget data available</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                budgets.map((budget, index) => (
                  <motion.tr
                    key={budget._id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * Math.min(index, 5),
                      duration: 0.3,
                    }}
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
                    <td className="px-4 py-3 text-right whitespace-nowrap text-[#f35b04] font-medium">
                      CHF {budget.usage?.actualCost?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-[#3d348b] font-medium">
                      CHF{" "}
                      {budget.usage?.remainingAmount?.toFixed(2) ||
                        budget.remainingAmount?.toFixed(2) ||
                        budget.amount?.toFixed(2) ||
                        "0.00"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-gray-900">
                      {budget.usage?.actualDistance?.toFixed(1) || "0.0"} km
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {budget.usage?.expenseCount || 0}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{
                              width: `${Math.min(
                                budget.usage?.usagePercentage ||
                                  budget.usagePercentage ||
                                  0,
                                100
                              )}%`,
                            }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              (budget.usage?.usagePercentage ||
                                budget.usagePercentage ||
                                0) >= budget.criticalThreshold
                                ? "bg-[#f35b04]"
                                : (budget.usage?.usagePercentage ||
                                    budget.usagePercentage ||
                                    0) >= budget.warningThreshold
                                ? "bg-[#f7b801]"
                                : "bg-green-500"
                            }`}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold inline-block mt-1">
                          {(
                            budget.usage?.usagePercentage ||
                            budget.usagePercentage ||
                            0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                          budget.status === "critical" ||
                          budget.status === "over"
                            ? "bg-[#f35b04]"
                            : budget.status === "warning"
                            ? "bg-[#f7b801]"
                            : "bg-green-500"
                        }`}
                      >
                        {(budget.status || "UNDER").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <Link to={`/admin/budgets/${budget._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-[#7678ed]/10 text-[#3d348b] hover:bg-[#7678ed]/20 transition-colors"
                          title="View Budget Details"
                        >
                          <FaEye size={16} />
                        </motion.button>
                      </Link>
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
                    : "bg-white border border-[#3d348b] text-[#3d348b] hover:bg-[#3d348b] hover:text-white transition-colors"
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
                    : "bg-white border border-[#3d348b] text-[#3d348b] hover:bg-[#3d348b] hover:text-white transition-colors"
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
