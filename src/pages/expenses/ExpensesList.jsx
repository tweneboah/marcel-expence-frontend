import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getExpenses } from "../../api/expenseApi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { formatDistance } from "../../utils/googleMaps";
import { useExpenseRoutes } from "../../utils/routeHelpers";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiChevronRight,
  FiRefreshCw,
  FiFileText,
  FiNavigation,
  FiMapPin as FiMapMarker,
  FiInfo,
  FiList,
  FiDollarSign,
  FiClock,
  FiSearch,
  FiFilter,
  FiArrowUpRight,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FaCar,
  FaRoute,
  FaMapMarkerAlt,
  FaRegClock,
  FaMoneyBillWave,
} from "react-icons/fa";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const routes = useExpenseRoutes();

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError("Failed to load expenses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Format date to display in a user-friendly format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter and search expenses
  const filteredExpenses = expenses
    .filter((expense) => {
      if (filterStatus === "all") return true;
      return expense.status === filterStatus;
    })
    .filter((expense) => {
      if (!searchTerm) return true;
      const startPoint = expense.startingPoint || expense.startLocation || "";
      const endPoint = expense.destinationPoint || expense.endLocation || "";
      const category = expense.category?.name || "";
      const date = formatDate(expense.journeyDate || expense.expenseDate || "");

      const searchLower = searchTerm.toLowerCase();
      return (
        startPoint.toLowerCase().includes(searchLower) ||
        endPoint.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower) ||
        date.toLowerCase().includes(searchLower)
      );
    });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Helper function to determine if an expense has waypoints
  const hasWaypoints = (expense) => {
    return (
      expense.waypoints &&
      Array.isArray(expense.waypoints) &&
      expense.waypoints.length > 0
    );
  };

  // Helper function to check if an expense has route instructions
  const hasRouteInstructions = (expense) => {
    return (
      expense.routeSnapshot?.route?.legs &&
      expense.routeSnapshot.route.legs.length > 0 &&
      expense.routeSnapshot.route.legs.some(
        (leg) => leg.steps && leg.steps.length > 0
      )
    );
  };

  // Get status icon based on expense status
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="mr-1" />;
      case "rejected":
        return <FiXCircle className="mr-1" />;
      default:
        return <FiAlertCircle className="mr-1" />;
    }
  };

  // Get status color based on expense status
  const getStatusColors = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-yellow-400 text-[#3d348b]";
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div
        className="relative mb-8 bg-gradient-to-r from-[#3d348b] to-[#7678ed] rounded-xl shadow-lg overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute right-0 top-0 h-full w-1/3 overflow-hidden">
          <svg
            className="absolute right-0 top-0 h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L100,0 Q50,50 100,100 L0,100 Z"
              fill="url(#headerGradient)"
              opacity="0.15"
            />
            <defs>
              <linearGradient
                id="headerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f7b801" />
                <stop offset="100%" stopColor="#f35b04" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="p-6 text-white relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <FaMoneyBillWave className="mr-3" /> My Expenses
              </h1>
              <p className="text-white/80 max-w-md">
                Track and manage your travel expenses efficiently
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <Link to={routes.newPath}>
                <Button
                  variant="secondary"
                  icon={<FiPlus />}
                  className="bg-[#f7b801] hover:bg-[#f7b801]/90 text-[#3d348b] border-none"
                >
                  Create Expense
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        variants={itemVariants}
        className="mb-6 bg-white rounded-lg shadow-md p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7678ed] focus:border-[#7678ed] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                filterStatus === "all"
                  ? "bg-[#3d348b] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiList className="mr-1.5" /> All
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                filterStatus === "pending"
                  ? "bg-[#f7b801] text-[#3d348b]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiAlertCircle className="mr-1.5" /> Pending
            </button>
            <button
              onClick={() => setFilterStatus("approved")}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                filterStatus === "approved"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiCheckCircle className="mr-1.5" /> Approved
            </button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          className="flex justify-center items-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="animate-spin h-10 w-10 text-[#7678ed]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants}>
          <Card className="border-red-300 shadow-lg">
            <div className="text-center p-8 text-red-600">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <FiXCircle className="h-8 w-8" />
                </div>
              </div>
              <p className="text-lg mb-4">{error}</p>
              <Button
                variant="primary"
                className="bg-[#7678ed] hover:bg-[#7678ed]/90 focus:ring-[#7678ed]/50"
                onClick={() => window.location.reload()}
              >
                <FiRefreshCw className="mr-2" /> Try Again
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : filteredExpenses.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="border-[#7678ed]/20 shadow-lg">
            <div className="text-center p-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-[#7678ed]/10 rounded-full">
                  <FaRoute className="h-10 w-10 text-[#7678ed]" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-[#3d348b] mb-2">
                {searchTerm || filterStatus !== "all"
                  ? "No matching expenses found"
                  : "No expenses yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "You haven't created any expenses yet. Start tracking your travel expenses now!"}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {(searchTerm || filterStatus !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                    }}
                    className="bg-[#7678ed] hover:bg-[#7678ed]/90 text-white"
                  >
                    <FiRefreshCw className="mr-2" /> Reset Filters
                  </Button>
                )}
                {!searchTerm && filterStatus === "all" && (
                  <Link to={routes.createPath}>
                    <Button className="bg-[#f35b04] hover:bg-[#f35b04]/90 text-white">
                      <FiPlus className="mr-2" /> Create Your First Expense
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div className="grid gap-5" variants={containerVariants}>
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense._id}
              variants={itemVariants}
              whileHover={{
                scale: 1.01,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#7678ed] hover:border-l-[#f35b04] transition-all duration-300"
            >
              <Link to={routes.detailPath(expense._id)} className="block p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1 pr-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-3 ${
                          hasWaypoints(expense)
                            ? "bg-[#f7b801]/10 text-[#f7b801]"
                            : "bg-[#3d348b]/10 text-[#3d348b]"
                        }`}
                      >
                        {hasWaypoints(expense) ? (
                          <FaRoute className="h-6 w-6" />
                        ) : (
                          <FaCar className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#3d348b] mb-1 line-clamp-1 flex items-center">
                          {expense.startingPoint || expense.startLocation}
                          <FiArrowUpRight className="mx-1" />
                          {expense.destinationPoint || expense.endLocation}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                            <FiCalendar className="h-3.5 w-3.5" />
                            {formatDate(
                              expense.journeyDate || expense.expenseDate
                            )}
                          </span>

                          {expense.status && (
                            <span
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColors(
                                expense.status
                              )}`}
                            >
                              {getStatusIcon(expense.status)}
                              {expense.status.charAt(0).toUpperCase() +
                                expense.status.slice(1)}
                            </span>
                          )}

                          {expense.category && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-[#7678ed]/10 text-[#7678ed] rounded-full">
                              {expense.category.name}
                            </span>
                          )}

                          {hasWaypoints(expense) && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-[#f7b801]/10 text-[#f7b801] rounded-full text-xs">
                              <FaMapMarkerAlt className="h-3 w-3" />
                              {expense.waypoints.length} waypoint
                              {expense.waypoints.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-[#3d348b]">
                            <FiTrendingUp className="h-4 w-4" />
                            {formatDistance(
                              expense.distance || expense.distanceInKm || 0
                            )}
                          </span>
                          {expense.routeSnapshot?.route?.legs &&
                            expense.routeSnapshot.route.legs[0]
                              ?.duration_text && (
                              <span className="flex items-center gap-1 text-[#7678ed]">
                                <FaRegClock className="h-4 w-4" />
                                {
                                  expense.routeSnapshot.route.legs[0]
                                    .duration_text
                                }
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center md:border-l md:border-gray-200 md:pl-4">
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs text-gray-500 mb-1">
                        Total Cost
                      </span>
                      <p className="text-xl font-semibold text-[#f35b04]">
                        {Number(expense.totalCost || 0).toFixed(2)} CHF
                      </p>
                      <motion.div
                        className="text-[#f35b04] flex items-center text-sm font-medium mt-1"
                        whileHover={{ x: 3 }}
                      >
                        View Details <FiChevronRight className="ml-1" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Summary Card at the bottom */}
          <motion.div
            variants={itemVariants}
            className="mt-4 bg-gradient-to-r from-[#3d348b] to-[#7678ed] rounded-lg shadow-lg p-5 text-white"
          >
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FiInfo className="mr-2" /> Summary
                </h3>
                <p className="text-white/80">
                  Total expenses: {filteredExpenses.length}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="text-sm text-white/80">Total Amount</p>
                  <p className="text-2xl font-bold">
                    {filteredExpenses
                      .reduce(
                        (sum, expense) => sum + (expense.totalCost || 0),
                        0
                      )
                      .toFixed(2)}{" "}
                    CHF
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpensesList;
