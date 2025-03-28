import React, { useState } from "react";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    costPerKilometer: 0.3,
    cateringAllowance: 25.0,
    accommodationAllowance: 100.0,
    otherAllowances: {
      tollFee: true,
      vignette: true,
    },
  });

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseFloat(value),
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      otherAllowances: {
        ...settings.otherAllowances,
        [name]: checked,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the settings
    console.log("Saving settings:", settings);

    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-gray-600">
          Configure global settings for the expense application
        </p>
      </div>

      {showSaveSuccess && (
        <div className="mb-6 p-4 border border-green-400 rounded bg-green-50 text-green-800">
          Settings updated successfully!
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Reimbursement Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Kilometer (€)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">€</span>
                  </div>
                  <input
                    type="number"
                    name="costPerKilometer"
                    value={settings.costPerKilometer}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Amount reimbursed per kilometer traveled.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catering Allowance (€)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">€</span>
                  </div>
                  <input
                    type="number"
                    name="cateringAllowance"
                    value={settings.cateringAllowance}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Daily allowance for meals when traveling.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation Allowance (€)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">€</span>
                  </div>
                  <input
                    type="number"
                    name="accommodationAllowance"
                    value={settings.accommodationAllowance}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Maximum allowance for overnight stays.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">
              Other Reimbursable Expenses
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="tollFee"
                    name="tollFee"
                    type="checkbox"
                    checked={settings.otherAllowances.tollFee}
                    onChange={handleCheckboxChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="tollFee"
                    className="font-medium text-gray-700"
                  >
                    Road Tolls
                  </label>
                  <p className="text-gray-500">
                    Allow reimbursement for road tolls
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="vignette"
                    name="vignette"
                    type="checkbox"
                    checked={settings.otherAllowances.vignette}
                    onChange={handleCheckboxChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="vignette"
                    className="font-medium text-gray-700"
                  >
                    Road Vignettes
                  </label>
                  <p className="text-gray-500">
                    Allow reimbursement for highway vignettes
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;
