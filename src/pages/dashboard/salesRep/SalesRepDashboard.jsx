import { useAuth } from "../../../context/AuthContext";

const SalesRepDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Sales Rep Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-xl mb-2">My Expenses</h2>
          <p className="text-gray-600 mb-4">Summary of your travel expenses</p>
          <div className="bg-blue-100 text-blue-800 p-3 rounded-md">
            <span className="font-bold text-2xl">12</span>
            <span className="ml-2">Expenses this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-xl mb-2">Distance Traveled</h2>
          <p className="text-gray-600 mb-4">Total kilometers this month</p>
          <div className="bg-green-100 text-green-800 p-3 rounded-md">
            <span className="font-bold text-2xl">750</span>
            <span className="ml-2">km</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-xl mb-2">Reimbursement</h2>
          <p className="text-gray-600 mb-4">Total reimbursement amount</p>
          <div className="bg-purple-100 text-purple-800 p-3 rounded-md">
            <span className="font-bold text-2xl">€225.00</span>
            <span className="ml-2">This month</span>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Recent Trips</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add New Trip
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2023-10-24</td>
                <td className="px-6 py-4 whitespace-nowrap">Munich → Berlin</td>
                <td className="px-6 py-4 whitespace-nowrap">580 km</td>
                <td className="px-6 py-4 whitespace-nowrap">€174.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Approved
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2023-10-21</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Munich → Stuttgart
                </td>
                <td className="px-6 py-4 whitespace-nowrap">220 km</td>
                <td className="px-6 py-4 whitespace-nowrap">€66.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Approved
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2023-10-18</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Munich → Frankfurt
                </td>
                <td className="px-6 py-4 whitespace-nowrap">390 km</td>
                <td className="px-6 py-4 whitespace-nowrap">€117.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
