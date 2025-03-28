import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiSave,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiSettings,
} from "react-icons/fi";

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would be an API call in a real app
      console.log("Updating profile:", {
        name: formData.name,
        email: formData.email,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setNotification({
        type: "success",
        message: "Profile updated successfully!",
      });

      setTimeout(() => {
        setNotification({ type: "", message: "" });
      }, 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      // This would be an API call in a real app
      console.log("Changing password");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setNotification({
        type: "success",
        message: "Password changed successfully!",
      });

      setTimeout(() => {
        setNotification({ type: "", message: "" });
      }, 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-6xl"
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
        <h1 className="text-3xl font-bold text-[#3d348b]">Profile Settings</h1>
      </motion.div>

      <motion.p
        className="text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Manage your account information and preferences
      </motion.p>

      {notification.message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-6 p-4 rounded-lg flex items-center ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <FiCheckCircle className="mr-3 text-green-500" />
          ) : (
            <FiXCircle className="mr-3 text-red-500" />
          )}
          {notification.message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <motion.div
          className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <FiUser className="text-[#7678ed] mr-2 text-xl" />
            <h2 className="text-xl font-semibold text-[#3d348b]">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <FiUser className="mr-2 text-gray-400" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#7678ed] focus:border-[#7678ed] transition-all"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <FiMail className="mr-2 text-gray-400" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#7678ed] focus:border-[#7678ed] transition-all"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#3d348b] to-[#7678ed] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7678ed] disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Update Profile
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <FiLock className="text-[#f7b801] mr-2 text-xl" />
            <h2 className="text-xl font-semibold text-[#3d348b]">
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <FiShield className="mr-2 text-gray-400" />
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#7678ed] focus:border-[#7678ed] transition-all"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <FiLock className="mr-2 text-gray-400" />
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#7678ed] focus:border-[#7678ed] transition-all"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <FiLock className="mr-2 text-gray-400" />
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-[#7678ed] focus:border-[#7678ed] transition-all"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#f7b801] to-[#f35b04] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f7b801] disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                "Changing..."
              ) : (
                <>
                  <FiLock className="mr-2" />
                  Change Password
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Account Danger Zone */}
      <motion.div
        className="mt-8 bg-white shadow-md rounded-xl p-6 border border-red-200 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 opacity-50 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <FiAlertTriangle className="text-red-500 mr-2 text-xl" />
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          </div>

          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          <motion.button
            className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiTrash2 className="mr-2" />
            Delete Account
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
