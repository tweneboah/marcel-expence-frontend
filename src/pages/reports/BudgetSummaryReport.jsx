import React, { useState, useEffect } from "react";
import {
  FaChartPie,
  FaCalendarAlt,
  FaFileExport,
  FaChevronDown,
  FaChevronUp,
  FaCircle,
  FaWallet,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaPercentage,
} from "react-icons/fa";
import API from "../../api/apiConfig";
import { motion, AnimatePresence } from "framer-motion";

const BudgetSummaryReport = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedMonths, setExpandedMonths] = useState({});

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  useEffect(() => {
    const fetchBudgetSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await API.get(`/budgets/summary?year=${selectedYear}`);
        console.log("Budget summary response:", response);

        if (response.data && response.data.success) {
          setSummaryData(response.data.data);
          // Expand current month by default
          const currentMonth = new Date().getMonth() + 1;
          setExpandedMonths((prev) => ({
            ...prev,
            [currentMonth]: true,
          }));
        } else {
          setError(null);
          setSummaryData(null);
        }
      } catch (err) {
        console.error("Error fetching budget summary:", err);
        // Don't set error for network errors or "no budgets found" errors, just show no data
        if (
          err.code === "ERR_NETWORK" ||
          err.code === "ERR_BAD_REQUEST" ||
          err.response?.status === 404 ||
          err.message?.includes("No budgets found")
        ) {
          setError(null);
        } else {
          setError(
            err.response?.data?.message || "Failed to fetch budget summary"
          );
        }
        setSummaryData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetSummary();
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const getYearsOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  const handleExport = () => {
    if (!summaryData) return;

    // Generate CSV content
    let csvContent =
      "Month,Category,Budgeted (CHF),Actual (CHF),Remaining (CHF),Usage %\n";

    summaryData.months.forEach((month) => {
      // Add month summary row
      csvContent += `${month.monthName},TOTAL,${month.totalBudgeted.toFixed(
        2
      )},${month.totalActual.toFixed(2)},${month.totalRemaining.toFixed(
        2
      )},${month.usagePercentage.toFixed(1)}\n`;

      // Add category rows
      month.categories.forEach((category) => {
        csvContent += `${month.monthName},${
          category.categoryName
        },${category.budgetedAmount.toFixed(2)},${category.actualAmount.toFixed(
          2
        )},${category.remaining.toFixed(2)},${category.usagePercentage.toFixed(
          1
        )}\n`;
      });
    });

    // Add yearly total
    csvContent += `YEARLY TOTAL,ALL CATEGORIES,${summaryData.yearlyTotal.totalBudgeted.toFixed(
      2
    )},${summaryData.yearlyTotal.totalActual.toFixed(
      2
    )},${summaryData.yearlyTotal.totalRemaining.toFixed(
      2
    )},${summaryData.yearlyTotal.usagePercentage.toFixed(1)}\n`;

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `budget-summary-${selectedYear}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to get status color based on usage percentage
  const getStatusColor = (
    percentage,
    warningThreshold = 75,
    criticalThreshold = 90
  ) => {
    if (percentage >= criticalThreshold) return "bg-[#f35b04]";
    if (percentage >= warningThreshold) return "bg-[#f7b801]";
    return "bg-green-500";
  };

  // Helper function to get text color based on usage percentage
  const getTextColor = (
    percentage,
    warningThreshold = 75,
    criticalThreshold = 90
  ) => {
    if (percentage >= criticalThreshold) return "text-[#f35b04]";
    if (percentage >= warningThreshold) return "text-[#f7b801]";
    return "text-green-500";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3d348b] mb-4"></div>
        <p className="text-gray-600">Loading budget summary data...</p>
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
            <FaChartPie className="mr-2 text-[#7678ed]" />
            Budget Summary Report
          </h1>
          <p className="text-gray-600">
            Monthly and yearly overview of budget allocation and usage
          </p>
        </motion.div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#7678ed] focus:border-[#7678ed] rounded-md"
            >
              {getYearsOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaCalendarAlt className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
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

      {summaryData && (
        <>
          {/* Yearly Summary Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <FaWallet className="mr-2 text-[#3d348b]" />
              {selectedYear} - Yearly Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center text-[#3d348b] mb-2">
                  <FaMoneyBillWave className="mr-2" />
                  <span className="font-medium">Total Budgeted</span>
                </div>
                <div className="text-xl font-bold">
                  CHF {summaryData.yearlyTotal.totalBudgeted.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center text-[#f35b04] mb-2">
                  <FaExchangeAlt className="mr-2" />
                  <span className="font-medium">Total Actual</span>
                </div>
                <div className="text-xl font-bold">
                  CHF {summaryData.yearlyTotal.totalActual.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center text-[#7678ed] mb-2">
                  <FaWallet className="mr-2" />
                  <span className="font-medium">Total Remaining</span>
                </div>
                <div className="text-xl font-bold">
                  CHF {summaryData.yearlyTotal.totalRemaining.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center text-gray-700 mb-2">
                  <FaPercentage className="mr-2" />
                  <span className="font-medium">Usage Percentage</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full max-w-[150px]">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{
                            width: `${Math.min(
                              summaryData.yearlyTotal.usagePercentage,
                              100
                            )}%`,
                          }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center ${getStatusColor(
                            summaryData.yearlyTotal.usagePercentage
                          )}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`ml-2 text-xl font-bold ${getTextColor(
                      summaryData.yearlyTotal.usagePercentage
                    )}`}
                  >
                    {summaryData.yearlyTotal.usagePercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Monthly Summaries */}
          <div className="space-y-4">
            {summaryData.months.map((month) => (
              <motion.div
                key={month.month}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div
                  className="px-6 py-4 flex items-center justify-between border-b border-gray-200 cursor-pointer"
                  onClick={() => toggleMonth(month.month)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-full rounded-full ${getStatusColor(
                        month.usagePercentage
                      )} mr-3`}
                    ></div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {month.monthName} {selectedYear}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Budgeted</span>
                      <span className="font-medium">
                        CHF {month.totalBudgeted.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Actual</span>
                      <span className="font-medium text-[#f35b04]">
                        CHF {month.totalActual.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Remaining</span>
                      <span className="font-medium text-[#3d348b]">
                        CHF {month.totalRemaining.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Usage</span>
                      <span
                        className={`font-medium ${getTextColor(
                          month.usagePercentage
                        )}`}
                      >
                        {month.usagePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      {expandedMonths[month.month] ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedMonths[month.month] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 py-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">
                          Category Breakdown
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
                                <th className="px-4 py-2 text-left">
                                  Category
                                </th>
                                <th className="px-4 py-2 text-right">
                                  Budgeted
                                </th>
                                <th className="px-4 py-2 text-right">Actual</th>
                                <th className="px-4 py-2 text-right">
                                  Remaining
                                </th>
                                <th className="px-4 py-2 text-right">
                                  Usage %
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {month.categories.map((category) => (
                                <tr
                                  key={category.categoryId}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center">
                                      <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{
                                          backgroundColor:
                                            category.categoryColor || "#999",
                                        }}
                                      ></div>
                                      <span>{category.categoryName}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium">
                                    CHF {category.budgetedAmount.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-[#f35b04] font-medium">
                                    CHF {category.actualAmount.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-[#3d348b] font-medium">
                                    CHF {category.remaining.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end">
                                      <div className="w-24">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                          <div
                                            style={{
                                              width: `${Math.min(
                                                category.usagePercentage,
                                                100
                                              )}%`,
                                            }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getStatusColor(
                                              category.usagePercentage
                                            )}`}
                                          ></div>
                                        </div>
                                      </div>
                                      <span
                                        className={`ml-2 font-medium ${getTextColor(
                                          category.usagePercentage
                                        )}`}
                                      >
                                        {category.usagePercentage.toFixed(1)}%
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {!summaryData && !isLoading && !error && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaChartPie className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Budget Summary Data
          </h3>
          <p className="text-gray-500">
            There is no budget summary data available for {selectedYear}.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            This might be because the API endpoint is not yet available or there
            are no budget records for this year.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BudgetSummaryReport;
