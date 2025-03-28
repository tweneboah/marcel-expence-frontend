import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiEdit,
  FiTag,
  FiCalendar,
  FiBarChart2,
  FiAlertTriangle,
  FiTrash2,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { getCategoryById, deleteCategory } from "../../api/expenseApi";
import Button from "../../components/ui/Button";

// Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  isDeleting,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#14213D]">
                Delete Category
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{categoryName}</span>? This action
              cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={onConfirm}
                disabled={isDeleting}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the dedicated function to fetch a category by ID
        const categoryData = await getCategoryById(id);
        setCategory(categoryData);
      } catch (err) {
        console.error("Error fetching category details:", err);
        setError("Failed to load category details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCategory(id);
      navigate("/admin/categories", {
        state: {
          notification: {
            type: "success",
            message: `Category "${category.name}" has been deleted.`,
          },
        },
      });
    } catch (err) {
      setError(`Failed to delete category: ${err.message || "Unknown error"}`);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Get the current time period's budget if available
  const getCurrentBudget = (period) => {
    if (
      !category ||
      !category.budgetLimits ||
      category.budgetLimits.length === 0
    ) {
      return null;
    }

    return category.budgetLimits.find(
      (limit) => limit.period === period && limit.isActive
    );
  };

  // Calculate usage percentage
  const getUsagePercentage = (budget) => {
    if (!budget || !category || !category.currentUsage) return 0;
    const usage = category.currentUsage[budget.period]?.amount || 0;
    return Math.min(Math.round((usage / budget.amount) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <FiTag className="h-8 w-8 text-[#FCA311] animate-pulse" />
          </div>
          <div className="absolute inset-0 border-4 border-[#FCA311]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#FCA311] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center"
        >
          <FiAlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error || "Category not found"}</p>
        </motion.div>
        <div className="mt-6">
          <Button
            onClick={() => navigate("/admin/categories")}
            className="bg-[#14213D] hover:bg-[#14213D]/90"
          >
            <FiArrowLeft className="mr-2" /> Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  const monthlyBudget = getCurrentBudget("monthly");
  const quarterlyBudget = getCurrentBudget("quarterly");
  const yearlyBudget = getCurrentBudget("yearly");

  const monthlyUsage = getUsagePercentage(monthlyBudget);
  const quarterlyUsage = getUsagePercentage(quarterlyBudget);
  const yearlyUsage = getUsagePercentage(yearlyBudget);

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        categoryName={category.name}
        isDeleting={isDeleting}
      />

      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/admin/categories")}
            className="bg-[#14213D] hover:bg-[#14213D]/90"
          >
            <FiArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-[#14213D]">
            Category Details
          </h1>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            <FiTrash2 className="mr-2" /> Delete
          </Button>
          <Link to={`/admin/categories/${id}/edit`}>
            <Button className="bg-[#FCA311] hover:bg-[#FCA311]/90">
              <FiEdit className="mr-2" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Category details card */}
      <motion.div
        className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {/* Category header */}
        <div className="bg-[#14213D] p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-full">
              <FiTag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              {category.description && (
                <p className="text-white/80 mt-1">{category.description}</p>
              )}
            </div>
          </div>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
            {category.isActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Budget information */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-[#14213D] mb-4 flex items-center">
            <FiBarChart2 className="mr-2 text-[#FCA311]" /> Budget Information
          </h3>

          {!monthlyBudget && !quarterlyBudget && !yearlyBudget ? (
            <p className="text-gray-500">
              No budget limits set for this category.
            </p>
          ) : (
            <div className="space-y-6">
              {/* Monthly budget */}
              {monthlyBudget && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-[#FCA311]" />
                      <span className="font-medium text-[#14213D]">
                        Monthly Budget
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#14213D]">
                      CHF {monthlyBudget.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        monthlyUsage > 90
                          ? "bg-red-500"
                          : monthlyUsage > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${monthlyUsage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Used: CHF{" "}
                      {(monthlyBudget.amount * (monthlyUsage / 100)).toFixed(2)}
                    </span>
                    <span>{monthlyUsage}% of budget</span>
                  </div>
                </div>
              )}

              {/* Quarterly budget */}
              {quarterlyBudget && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-[#FCA311]" />
                      <span className="font-medium text-[#14213D]">
                        Quarterly Budget
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#14213D]">
                      CHF {quarterlyBudget.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        quarterlyUsage > 90
                          ? "bg-red-500"
                          : quarterlyUsage > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${quarterlyUsage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Used: CHF{" "}
                      {(
                        quarterlyBudget.amount *
                        (quarterlyUsage / 100)
                      ).toFixed(2)}
                    </span>
                    <span>{quarterlyUsage}% of budget</span>
                  </div>
                </div>
              )}

              {/* Yearly budget */}
              {yearlyBudget && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-[#FCA311]" />
                      <span className="font-medium text-[#14213D]">
                        Yearly Budget
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#14213D]">
                      CHF {yearlyBudget.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        yearlyUsage > 90
                          ? "bg-red-500"
                          : yearlyUsage > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${yearlyUsage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Used: CHF{" "}
                      {(yearlyBudget.amount * (yearlyUsage / 100)).toFixed(2)}
                    </span>
                    <span>{yearlyUsage}% of budget</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryDetail;
