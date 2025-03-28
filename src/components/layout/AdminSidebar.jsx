import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUsers,
  FaUserShield,
  FaChartPie,
  FaChartLine,
  FaTable,
  FaSearch,
  FaChartBar,
  FaFileAlt,
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaAngleDown,
  FaAngleUp,
  FaDollarSign,
  FaChartArea,
  FaProjectDiagram,
  FaCarSide,
  FaRoute,
  FaMoneyBillWave,
  FaColumns,
  FaTachometerAlt,
  FaWallet,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    analytics: true,
    reports: false,
    budgets: false,
    users: false,
    settings: false,
  });

  // Toggle submenu expansion
  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Animation variants for the submenu
  const menuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Check if a menu section is active (at least one of its items is active)
  const isMenuActive = (sectionItems) => {
    return sectionItems.some((item) => location.pathname === item.to);
  };

  // Navigation structure
  const navigationSections = [
    {
      id: "analytics",
      label: "Analytics",
      icon: <FaChartPie />,
      items: [
        {
          to: "/admin/analytics/overview",
          label: "Overview",
          icon: <FaChartPie className="mr-2" />,
        },
        {
          to: "/admin/analytics/expenses",
          label: "Expense Analytics",
          icon: <FaChartLine className="mr-2" />,
        },
        {
          to: "/admin/analytics/users",
          label: "User Analytics",
          icon: <FaUsers className="mr-2" />,
        },
        {
          to: "/admin/analytics/trends",
          label: "Trends",
          icon: <FaChartBar className="mr-2" />,
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FaFileAlt />,
      items: [
        {
          to: "/admin/reports",
          label: "Overview",
          icon: <FaChartPie className="mr-2" />,
        },
        {
          to: "/admin/reports/ytd",
          label: "YTD Reports",
          icon: <FaFileAlt className="mr-2" />,
        },
        {
          to: "/admin/reports/budget-comparison",
          label: "Budget Comparison",
          icon: <FaChartBar className="mr-2" />,
        },
        {
          to: "/admin/reports/chart-data",
          label: "Chart Data",
          icon: <FaChartArea className="mr-2" />,
        },
        {
          to: "/admin/reports/forecast",
          label: "Expense Forecasting",
          icon: <FaChartLine className="mr-2" />,
        },
        {
          to: "/admin/reports/yearly-comparison",
          label: "Yearly Comparison",
          icon: <FaChartArea className="mr-2" />,
        },
        {
          to: "/admin/reports/filtered-expenses",
          label: "Advanced Filtered Expenses",
          icon: <FaSearch className="mr-2" />,
        },
        {
          to: "/admin/reports/budget-summary",
          label: "Budget Summary",
          icon: <FaTable className="mr-2" />,
        },
        {
          to: "/admin/reports/all-budgets",
          label: "All Budgets",
          icon: <FaWallet className="mr-2" />,
        },
        {
          to: "/admin/reports/budget-details",
          label: "Budget Details",
          icon: <FaFileInvoiceDollar className="mr-2" />,
        },
      ],
    },
    {
      id: "budgets",
      label: "Budgets",
      icon: <FaWallet />,
      items: [
        {
          to: "/admin/budgets",
          label: "Budget Overview",
          icon: <FaChartPie className="mr-2" />,
        },
        {
          to: "/admin/budgets/create",
          label: "Create Budget",
          icon: <FaMoneyBillWave className="mr-2" />,
        },
        {
          to: "/admin/budgets/summary",
          label: "Budget Summary",
          icon: <FaTable className="mr-2" />,
        },
        {
          to: "/admin/reports/budget-summary",
          label: "Budget Summary Report",
          icon: <FaChartBar className="mr-2" />,
        },
        {
          to: "/admin/reports/budget-comparison",
          label: "Budget Comparison",
          icon: <FaChartBar className="mr-2" />,
        },
        {
          to: "/admin/reports/all-budgets",
          label: "All Budgets Report",
          icon: <FaFileAlt className="mr-2" />,
        },
        {
          to: "/admin/reports/budget-details",
          label: "Budget Details Report",
          icon: <FaFileInvoiceDollar className="mr-2" />,
        },
      ],
    },
    {
      id: "users",
      label: "User Management",
      icon: <FaUsers />,
      items: [
        {
          to: "/admin/users/list",
          label: "User List",
          icon: <FaUsers className="mr-2" />,
        },
        {
          to: "/admin/users/roles",
          label: "Role Management",
          icon: <FaUserShield className="mr-2" />,
        },
        {
          to: "/admin/users/permissions",
          label: "Permissions",
          icon: <FaUserShield className="mr-2" />,
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaCog />,
      items: [
        {
          to: "/admin/settings/general",
          label: "General Settings",
          icon: <FaCog className="mr-2" />,
        },
        {
          to: "/admin/settings/notifications",
          label: "Notifications",
          icon: <FaRegCalendarAlt className="mr-2" />,
        },
        {
          to: "/admin/settings/integrations",
          label: "Integrations",
          icon: <FaProjectDiagram className="mr-2" />,
        },
      ],
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-[#14213D] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FaHome className="mr-3" />
          Dashboard
        </NavLink>

        {navigationSections.map((section) => (
          <div key={section.id} className="rounded-md overflow-hidden">
            <button
              onClick={() => toggleSubmenu(section.id)}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                isMenuActive(section.items)
                  ? "bg-[#14213D] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center">
                <span className="mr-3">{section.icon}</span>
                {section.label}
              </span>
              {expandedMenus[section.id] ? <FaAngleUp /> : <FaAngleDown />}
            </button>

            <motion.div
              initial={expandedMenus[section.id] ? "open" : "closed"}
              animate={expandedMenus[section.id] ? "open" : "closed"}
              variants={menuVariants}
              className="overflow-hidden"
            >
              <div className="pl-4 pt-1 pb-1 space-y-1 bg-gray-50">
                {section.items.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? "bg-[#FCA311] text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
