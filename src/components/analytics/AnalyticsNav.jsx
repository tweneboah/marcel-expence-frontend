import { Link } from "react-router-dom";

const AnalyticsNav = ({ activeTab }) => {
  const tabs = [
    {
      id: "time-summary",
      label: "Time Summary",
      path: "/admin/analytics/time-summary",
    },
    {
      id: "category-breakdown",
      label: "Category Breakdown",
      path: "/admin/analytics/category-breakdown",
    },
    {
      id: "expense-trends",
      label: "Expense Trends",
      path: "/admin/analytics/expense-trends",
    },
    {
      id: "yearly-comparison",
      label: "Yearly Comparison",
      path: "/admin/analytics/yearly-comparison",
    },
  ];

  return (
    <nav className="mb-8">
      <ul className="flex flex-wrap border-b border-gray-200">
        <li className="mr-2">
          <Link
            to="/admin/analytics"
            className={`inline-block py-2 px-4 rounded-t-lg ${
              !activeTab ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            Overview
          </Link>
        </li>
        {tabs.map((tab) => (
          <li key={tab.id} className="mr-2">
            <Link
              to={tab.path}
              className={`inline-block py-2 px-4 rounded-t-lg ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AnalyticsNav;
