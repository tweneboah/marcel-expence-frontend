import { useAuth } from "../../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-xl mb-2">User Management</h2>
          <p className="text-gray-600 mb-4">Manage sales representatives</p>
          <div className="bg-blue-100 text-blue-800 p-3 rounded-md">
            <span className="font-bold text-2xl">5</span>
            <span className="ml-2">Total users</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-xl mb-2">Expense Tracking</h2>
          <p className="text-gray-600 mb-4">Monitor expense submissions</p>
          <div className="bg-green-100 text-green-800 p-3 rounded-md">
            <span className="font-bold text-2xl">24</span>
            <span className="ml-2">Expenses this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-xl mb-2">System Settings</h2>
          <p className="text-gray-600 mb-4">Configure application settings</p>
          <div className="bg-purple-100 text-purple-800 p-3 rounded-md">
            <span className="font-bold">€0.30/km</span>
            <span className="ml-2">Current rate</span>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold text-xl mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Submitted expense
                </td>
                <td className="px-6 py-4 whitespace-nowrap">2023-10-24</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                <td className="px-6 py-4 whitespace-nowrap">Updated profile</td>
                <td className="px-6 py-4 whitespace-nowrap">2023-10-23</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Mike Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap">Created account</td>
                <td className="px-6 py-4 whitespace-nowrap">2023-10-22</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
