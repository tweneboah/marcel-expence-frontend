import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSave, FaTimes, FaExclamationTriangle } from "react-icons/fa";

const EditBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    category: "",
    amount: "",
    maxDistance: "",
    notes: "",
    warningThreshold: 75,
    criticalThreshold: 90,
    isActive: true,
  });

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setIsLoading(true);

        // In production, call the actual API
        // const response = await axios.get(`/api/v1/budgets/${id}`);
        // setFormData(response.data.data);

        // Mock data for demo
        // Simulate API call delay
        setTimeout(() => {
          const mockBudget = {
            _id: id,
            year: 2023,
            month: 11,
            category: "60d5ec9af682fbf6bff9175e", // Just the ID
            amount: 1200,
            maxDistance: 800,
            warningThreshold: 75,
            criticalThreshold: 90,
            isActive: true,
            notes: "Regular budget for November fuel expenses",
            createdAt: "2023-10-28T08:30:00.000Z",
            updatedAt: "2023-10-28T08:30:00.000Z",
          };

          setFormData(mockBudget);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching budget details:", err);
        setError("Failed to load budget details. Please try again later.");
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        // In production, call the actual API
        // const response = await axios.get('/api/v1/categories');
        // setCategories(response.data.data);

        // Mock data for demo
        setCategories([
          { _id: "60d5ec9af682fbf6bff9175e", name: "Fuel", color: "#FF5722" },
          { _id: "60d5ec9af682fbf6bff9175f", name: "Tolls", color: "#2196F3" },
          {
            _id: "60d5ec9af682fbf6bff91760",
            name: "Maintenance",
            color: "#4CAF50",
          },
        ]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchBudget();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // In production, call the actual API
      // await axios.put(`/api/v1/budgets/${id}`, formData);

      // Mock success for demo
      console.log("Budget data updated:", formData);
      setTimeout(() => {
        setIsSaving(false);
        navigate("/admin/budgets");
      }, 1000);
    } catch (err) {
      console.error("Error updating budget:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update budget. Please try again."
      );
      setIsSaving(false);
    }
  };

  const generateMonthOptions = () => {
    const months = [
      { value: 1, label: "January" },
      { value: 2, label: "February" },
      { value: 3, label: "March" },
      { value: 4, label: "April" },
      { value: 5, label: "May" },
      { value: 6, label: "June" },
      { value: 7, label: "July" },
      { value: 8, label: "August" },
      { value: 9, label: "September" },
      { value: 10, label: "October" },
      { value: 11, label: "November" },
      { value: 12, label: "December" },
      { value: 0, label: "Annual Budget" },
    ];

    return months.map((month) => (
      <option key={month.value} value={month.value}>
        {month.label}
      </option>
    ));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i);
    }

    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <FaSave className="mr-2" /> Edit Budget
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Period Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {generateYearOptions()}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {generateMonthOptions()}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select "Annual Budget" for a yearly budget instead of monthly
                </p>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount (CHF)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 500.00"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Max Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Distance (km)
                </label>
                <input
                  type="number"
                  name="maxDistance"
                  value={formData.maxDistance}
                  onChange={handleChange}
                  placeholder="e.g. 750"
                  min="0"
                  step="0.1"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Set a maximum allowed distance for this budget
                </p>
              </div>

              {/* Warning Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warning Threshold (%)
                </label>
                <input
                  type="number"
                  name="warningThreshold"
                  value={formData.warningThreshold}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  When budget usage reaches this percentage, a warning will be
                  shown
                </p>
              </div>

              {/* Critical Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Critical Threshold (%)
                </label>
                <input
                  type="number"
                  name="criticalThreshold"
                  value={formData.criticalThreshold}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  When budget usage reaches this percentage, a critical alert
                  will be shown
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes or comments about this budget"
                rows="3"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Active Status */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Budget is active
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/budgets")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 flex items-center ${
                  isSaving ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                <FaSave className="mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditBudget;
