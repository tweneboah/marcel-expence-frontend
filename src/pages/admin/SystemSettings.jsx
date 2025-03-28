import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiCreditCard,
  FiHome,
  FiTruck,
  FiSave,
} from "react-icons/fi";

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
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

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
    <motion.div
      className="container mx-auto px-4 py-8 max-w-5xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex items-center mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiSettings className="text-[#f7b801] mr-3 text-2xl" />
        <h1 className="text-3xl font-bold text-[#3d348b]">System Settings</h1>
      </motion.div>

      <motion.p
        className="text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Configure global settings for the expense application
      </motion.p>

      {showSaveSuccess && (
        <motion.div
          className="mb-6 p-4 rounded-lg flex items-center"
          style={{ backgroundColor: "rgba(247, 184, 1, 0.1)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FiCheck className="text-[#f7b801] mr-3 text-xl" />
          <span className="font-medium text-gray-800">
            Settings updated successfully!
          </span>
        </motion.div>
      )}

      <motion.div
        className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
        variants={itemVariants}
      >
        <form onSubmit={handleSubmit}>
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="flex items-center mb-4">
              <FiDollarSign className="text-[#7678ed] mr-2 text-xl" />
              <h2 className="text-xl font-semibold text-[#3d348b]">
                Reimbursement Rates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Kilometer (CHF)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">CHF</span>
                  </div>
                  <input
                    type="number"
                    name="costPerKilometer"
                    value={settings.costPerKilometer}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-[#7678ed] focus:border-[#7678ed] py-2 transition-all"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Amount reimbursed per kilometer traveled.
                </p>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catering Allowance (CHF)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">CHF</span>
                  </div>
                  <input
                    type="number"
                    name="cateringAllowance"
                    value={settings.cateringAllowance}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-[#7678ed] focus:border-[#7678ed] py-2 transition-all"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Daily allowance for meals when traveling.
                </p>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation Allowance (CHF)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">CHF</span>
                  </div>
                  <input
                    type="number"
                    name="accommodationAllowance"
                    value={settings.accommodationAllowance}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-[#7678ed] focus:border-[#7678ed] py-2 transition-all"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Maximum allowance for overnight stays.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="mb-8" variants={itemVariants}>
            <div className="flex items-center mb-4">
              <FiCreditCard className="text-[#f35b04] mr-2 text-xl" />
              <h2 className="text-xl font-semibold text-[#3d348b]">
                Other Reimbursable Expenses
              </h2>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-lg p-5">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="tollFee"
                    name="tollFee"
                    type="checkbox"
                    checked={settings.otherAllowances.tollFee}
                    onChange={handleCheckboxChange}
                    className="focus:ring-[#7678ed] h-5 w-5 text-[#7678ed] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="tollFee"
                    className="font-medium text-gray-700 flex items-center"
                  >
                    <FiTruck className="text-[#f7b801] mr-2" />
                    Road Tolls
                  </label>
                  <p className="text-gray-500 mt-1 ml-6">
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
                    className="focus:ring-[#7678ed] h-5 w-5 text-[#7678ed] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="vignette"
                    className="font-medium text-gray-700 flex items-center"
                  >
                    <FiHome className="text-[#f35b04] mr-2" />
                    Road Vignettes
                  </label>
                  <p className="text-gray-500 mt-1 ml-6">
                    Allow reimbursement for highway vignettes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-end"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <button
              type="submit"
              className="bg-gradient-to-r from-[#3d348b] to-[#7678ed] text-white px-5 py-2 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7678ed] transition-all duration-300 flex items-center"
            >
              <FiSave className="mr-2" />
              Save Settings
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SystemSettings;
