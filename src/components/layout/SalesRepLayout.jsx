import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SalesRepLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "home" },
    { path: "/expenses", label: "Expenses", icon: "currency-dollar" },
    { path: "/expenses/create", label: "Add Expense", icon: "plus-circle" },
    { path: "/reports", label: "Reports", icon: "chart-bar" },
    { path: "/profile", label: "Profile", icon: "user" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-64 bg-indigo-800 transition duration-300 transform md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="flex items-center justify-center h-16 bg-indigo-900">
          <span className="text-white font-semibold text-lg">
            Expense Manager
          </span>
        </div>

        <div className="px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    location.pathname === item.path
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
                  }`}
                >
                  <span className="ml-3">{item.label}</span>
                </Link>
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
            className="p-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-6 h-6"
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
                  {user?.name || "Sales Rep"}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

export default SalesRepLayout;
