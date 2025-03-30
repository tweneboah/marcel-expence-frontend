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
import UpdateProfile from "./UpdateProfile";
import ChangePassword from "./ChangePassword";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile or password

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would be an API call in a real app
      console.log("Updating profile:", {
        name: user?.name,
        email: user?.email,
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

    if (user?.newPassword !== user?.confirmPassword) {
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

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`${
              activeTab === "profile"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center mr-8`}
          >
            <FiUser className="mr-2" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`${
              activeTab === "password"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FiLock className="mr-2" />
            Change Password
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <motion.div
          className="bg-white shadow-md rounded-xl p-6 border border-gray-100 h-fit"
          variants={itemVariants}
        >
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 text-4xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex items-center py-2">
              <FiUser className="text-gray-400 mr-3" />
              <div>
                <div className="text-xs text-gray-500">Name</div>
                <div className="font-medium">{user?.name || "Not set"}</div>
              </div>
            </div>

            <div className="flex items-center py-2">
              <FiMail className="text-gray-400 mr-3" />
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="font-medium">{user?.email || "Not set"}</div>
              </div>
            </div>

            <div className="flex items-center py-2">
              <FiShield className="text-gray-400 mr-3" />
              <div>
                <div className="text-xs text-gray-500">Role</div>
                <div className="font-medium capitalize">
                  {user?.role || "User"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div className="md:col-span-2" variants={itemVariants}>
          {activeTab === "profile" ? <UpdateProfile /> : <ChangePassword />}
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
