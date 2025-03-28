import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaChartPie,
  FaChartLine,
  FaChartArea,
} from "react-icons/fa";

const Analytics = () => {
  const analyticsModules = [
    {
      title: "Time Period Summary",
      description: "View expense summaries by month, quarter, and year",
      path: "/admin/analytics/time-summary",
      icon: <FaCalendarAlt size={24} />,
      color: "#072ac8",
    },
    {
      title: "Category Breakdown",
      description: "Analyze expenses by category with detailed charts",
      path: "/admin/analytics/category-breakdown",
      icon: <FaChartPie size={24} />,
      color: "#1e96fc",
    },
    {
      title: "Expense Trends",
      description: "Track expense trends over time with moving averages",
      path: "/admin/analytics/expense-trends",
      icon: <FaChartLine size={24} />,
      color: "#fcf300",
    },
    {
      title: "Yearly Comparison",
      description: "Compare expenses year-over-year to spot patterns",
      path: "/admin/analytics/yearly-comparison",
      icon: <FaChartArea size={24} />,
      color: "#ffc600",
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analytics Dashboard
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Select an analytics module to view detailed insights
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {analyticsModules.map((module, index) => (
          <motion.div
            key={module.path}
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={module.path} className="block h-full">
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden h-full border-t-4"
                style={{ borderColor: module.color }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: `${module.color}20` }}
                    >
                      <span
                        className="text-gray-800"
                        style={{ color: module.color }}
                      >
                        {module.icon}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      Module {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{module.description}</p>

                  <div className="mt-auto pt-2">
                    <span
                      className="inline-flex items-center text-sm font-medium"
                      style={{ color: module.color }}
                    >
                      View Analytics
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-10 bg-gradient-to-r from-[#072ac8] to-[#1e96fc] rounded-lg shadow-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Need a custom report?</h3>
            <p className="text-blue-100">
              Generate tailored reports with the specific metrics you need
            </p>
          </div>
          <Link
            to="/admin/reports"
            className="mt-4 md:mt-0 px-6 py-2 bg-white text-[#072ac8] rounded-md font-medium hover:bg-opacity-90 transition-colors duration-200"
          >
            Go to Reports
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
