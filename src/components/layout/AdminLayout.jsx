import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaChartArea,
  FaCalendarAlt,
  FaUserCog,
  FaTags,
  FaCog,
  FaFileAlt,
  FaAngleDown,
  FaAngleUp,
  FaTable,
  FaSearch,
  FaWallet,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    analytics: location.pathname.includes("/admin/analytics"),
    reports: location.pathname.includes("/admin/reports"),
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaChartBar size={18} />,
    },
    {
      path: "/admin/expenses",
      label: "Expenses",
      icon: <FaFileAlt size={18} />,
    },
    {
      path: "/admin/users",
      label: "User Management",
      icon: <FaUserCog size={18} />,
    },
    {
      path: "/admin/categories",
      label: "Categories",
      icon: <FaTags size={18} />,
    },
    {
      label: "Budgets",
      icon: <FaWallet size={18} />,
      submenu: true,
      subItems: [
        {
          path: "/admin/budgets",
          label: "Budget Overview",
          icon: <FaChartPie size={14} />,
        },
        {
          path: "/admin/budgets/create",
          label: "Create Budget",
          icon: <FaMoneyBillWave size={14} />,
        },
        {
          path: "/admin/budgets/summary",
          label: "Budget Summary",
          icon: <FaTable size={14} />,
        },
        {
          path: "/admin/reports/budget-comparison",
          label: "Budget Comparison",
          icon: <FaChartBar size={14} />,
        },
        {
          path: "/admin/reports/all-budgets",
          label: "All Budgets",
          icon: <FaFileAlt size={14} />,
        },
        {
          path: "/admin/reports/budget-details",
          label: "Budget Details",
          icon: <FaFileInvoiceDollar size={14} />,
        },
      ],
    },
    {
      label: "Analytics",
      icon: <FaChartPie size={18} />,
      submenu: true,
      subItems: [
        {
          path: "/admin/analytics/time-summary",
          label: "Time Summary",
          icon: <FaCalendarAlt size={14} />,
        },
        {
          path: "/admin/analytics/category-breakdown",
          label: "Category Breakdown",
          icon: <FaChartPie size={14} />,
        },
        {
          path: "/admin/analytics/expense-trends",
          label: "Expense Trends",
          icon: <FaChartLine size={14} />,
        },
        {
          path: "/admin/analytics/yearly-comparison",
          label: "Yearly Comparison",
          icon: <FaChartArea size={14} />,
        },
      ],
    },
    {
      label: "Reports",
      icon: <FaFileAlt size={18} />,
      submenu: true,
      subItems: [
        {
          path: "/admin/reports",
          label: "Overview",
          icon: <FaTable className="mr-1" />,
        },
        {
          path: "/admin/reports/ytd",
          label: "YTD Reports",
          icon: <FaTable className="mr-1" />,
        },
        {
          path: "/admin/reports/budget-comparison",
          label: "Budget Comparison",
          icon: <FaTable className="mr-1" />,
        },
        {
          path: "/admin/reports/chart-data",
          label: "Chart Data",
          icon: <FaChartArea className="mr-1" />,
        },
        {
          path: "/admin/reports/expense-trends",
          label: "Expense Trends",
          icon: <FaTable className="mr-1" />,
        },
        {
          path: "/admin/reports/forecast",
          label: "Expense Forecasting",
          icon: <FaChartLine className="mr-1" />,
        },
        {
          path: "/admin/reports/yearly-comparison",
          label: "Yearly Comparison",
          icon: <FaTable className="mr-1" />,
        },
        {
          path: "/admin/reports/filtered-expenses",
          label: "Advanced Filtered Expenses",
          icon: <FaSearch className="mr-1" />,
        },
        {
          path: "/admin/reports/budget-summary",
          label: "Budget Summary",
          icon: <FaTable className="mr-1" />,
        },
        {
          path: "/admin/reports/all-budgets",
          label: "All Budgets",
          icon: <FaWallet className="mr-1" />,
        },
        {
          path: "/admin/reports/budget-details",
          label: "Budget Details",
          icon: <FaFileInvoiceDollar className="mr-1" />,
        },
      ],
    },
    {
      path: "/admin/settings",
      label: "System Settings",
      icon: <FaCog size={18} />,
    },
  ];

  const isActiveMenu = (item) => {
    if (item.submenu) {
      return item.subItems.some(
        (subItem) => location.pathname === subItem.path
      );
    }
    return location.pathname === item.path;
  };

  const isActiveSubItem = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#072ac8] to-[#1e96fc] transition duration-300 transform md:translate-x-0 md:static md:inset-auto shadow-lg`}
      >
        <div className="flex items-center justify-center h-16 bg-[#072ac8]">
          <span className="text-white font-semibold text-lg">Admin Panel</span>
        </div>

        <div className="px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={item.label || index}>
                {item.submenu ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.label.toLowerCase())}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-md transition duration-200 ${
                        isActiveMenu(item)
                          ? "bg-white text-[#072ac8]"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span>
                        {expandedMenus[item.label.toLowerCase()] ? (
                          <FaAngleUp size={16} />
                        ) : (
                          <FaAngleDown size={16} />
                        )}
                      </span>
                    </button>

                    <AnimatePresence>
                      {expandedMenus[item.label.toLowerCase()] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="pl-7 space-y-1">
                            {item.subItems.map((subItem) => (
                              <motion.li
                                key={subItem.path}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  to={subItem.path}
                                  className={`flex items-center px-4 py-2 text-sm rounded-md transition duration-200 ${
                                    isActiveSubItem(subItem.path)
                                      ? "bg-white/20 text-white font-medium"
                                      : "text-white/80 hover:bg-white/10"
                                  }`}
                                >
                                  <span className="mr-2">{subItem.icon}</span>
                                  <span>{subItem.label}</span>
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md transition duration-200 ${
                      location.pathname === item.path
                        ? "bg-white text-[#072ac8]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e96fc]"
          >
            <svg
              className="w-6 h-6 text-[#072ac8]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="font-medium text-gray-900">
                  {user?.name || "Admin"}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-white bg-[#1e96fc] rounded-md hover:bg-[#072ac8] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e96fc]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
