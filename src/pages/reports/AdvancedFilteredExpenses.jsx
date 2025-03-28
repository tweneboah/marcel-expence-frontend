import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFilter,
  FaFileExport,
  FaCalendarAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BASE_URL } from "../../api/apiConfig";
import API from "../../api/apiConfig";

const AdvancedFilteredExpenses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  // Filter states
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  });
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minDistance, setMinDistance] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [locations, setLocations] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch categories first
    const fetchCategories = async () => {
      try {
        // Use API instance with auth headers instead of direct axios request
        const response = await API.get(`/categories`);
        setCategories(response.data.data);

        // Comment out mock data since we're using the real API
        // setTimeout(() => {
        //   setCategories([
        //     { id: "fuel", name: "Fuel", color: "#FF5722" },
        //     { id: "tolls", name: "Tolls", color: "#3F51B5" },
        //     { id: "maintenance", name: "Maintenance", color: "#4CAF50" },
        //   ]);
        // }, 300);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Fallback to default categories if API fails
        setCategories([
          { id: "fuel", name: "Fuel", color: "#FF5722" },
          { id: "tolls", name: "Tolls", color: "#3F51B5" },
          { id: "maintenance", name: "Maintenance", color: "#4CAF50" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [pagination.page, sortField, sortDirection]);

  const fetchExpenses = async (applyFilters = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: `${sortField}:${sortDirection}`,
      };

      // Add filters if requested
      if (applyFilters) {
        if (dateRange.startDate)
          params.startDate = dateRange.startDate.toISOString().split("T")[0];
        if (dateRange.endDate)
          params.endDate = dateRange.endDate.toISOString().split("T")[0];
        if (minAmount) params.minAmount = minAmount;
        if (maxAmount) params.maxAmount = maxAmount;
        if (minDistance) params.minDistance = minDistance;
        if (maxDistance) params.maxDistance = maxDistance;
        if (locations) params.locations = locations;
        if (selectedCategories.length > 0)
          params.categories = selectedCategories.join(",");
        if (searchTerm) params.search = searchTerm;
      }

      // Use API instance with auth headers instead of direct axios request
      const response = await API.get(`/advanced-reports/expenses`, { params });
      setExpenses(response.data.data.results);
      setPagination({
        page: response.data.data.page,
        limit: response.data.data.limit,
        totalPages: response.data.data.totalPages,
        totalResults: response.data.data.totalResults,
      });
      setTotalExpenses(response.data.data.totalAmount);
      setIsLoading(false);

      // Comment out mock data
      // setTimeout(() => {
      //   const mockData = getMockData(params);
      //   setExpenses(mockData.results);
      //   setPagination({
      //     page: mockData.page,
      //     limit: mockData.limit,
      //     totalPages: mockData.totalPages,
      //     totalResults: mockData.totalResults,
      //   });
      //   setTotalExpenses(mockData.totalAmount);
      //   setIsLoading(false);
      // }, 800);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses. Please try again later.");
      setIsLoading(false);
    }
  };

  const getMockData = (params) => {
    // Generate 30 mock expenses
    const allExpenses = Array.from({ length: 30 }, (_, i) => {
      const index = i + 1;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      const category = categories[
        Math.floor(Math.random() * categories.length)
      ] || { id: "fuel", name: "Fuel", color: "#FF5722" };

      const fromLocations = ["Zürich", "Geneva", "Basel", "Bern", "Lausanne"];
      const toLocations = [
        "Lucerne",
        "St. Gallen",
        "Winterthur",
        "Lugano",
        "Biel",
      ];

      const distance = 50 + Math.floor(Math.random() * 200);
      const amount = distance * 0.7 + Math.floor(Math.random() * 20);

      return {
        id: `exp-${index}`,
        date: date.toISOString(),
        from: fromLocations[Math.floor(Math.random() * fromLocations.length)],
        to: toLocations[Math.floor(Math.random() * toLocations.length)],
        distance: distance,
        amount: amount,
        category: category,
        notes: `Expense ${index} notes`,
        status: Math.random() > 0.2 ? "approved" : "pending",
      };
    });

    // Apply filters
    let filteredExpenses = [...allExpenses];

    // Filter by date range
    if (params.startDate) {
      const startDate = new Date(params.startDate);
      filteredExpenses = filteredExpenses.filter(
        (exp) => new Date(exp.date) >= startDate
      );
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate);
      filteredExpenses = filteredExpenses.filter(
        (exp) => new Date(exp.date) <= endDate
      );
    }

    // Filter by amount range
    if (params.minAmount) {
      filteredExpenses = filteredExpenses.filter(
        (exp) => exp.amount >= Number(params.minAmount)
      );
    }

    if (params.maxAmount) {
      filteredExpenses = filteredExpenses.filter(
        (exp) => exp.amount <= Number(params.maxAmount)
      );
    }

    // Filter by distance range
    if (params.minDistance) {
      filteredExpenses = filteredExpenses.filter(
        (exp) => exp.distance >= Number(params.minDistance)
      );
    }

    if (params.maxDistance) {
      filteredExpenses = filteredExpenses.filter(
        (exp) => exp.distance <= Number(params.maxDistance)
      );
    }

    // Filter by locations
    if (params.locations) {
      const locationTerms = params.locations
        .toLowerCase()
        .split(",")
        .map((term) => term.trim());
      filteredExpenses = filteredExpenses.filter((exp) =>
        locationTerms.some(
          (term) =>
            exp.from.toLowerCase().includes(term) ||
            exp.to.toLowerCase().includes(term)
        )
      );
    }

    // Filter by categories
    if (params.categories) {
      const categoryIds = params.categories.split(",");
      filteredExpenses = filteredExpenses.filter((exp) =>
        categoryIds.includes(exp.category.id)
      );
    }

    // Filter by search term
    if (params.search) {
      const search = params.search.toLowerCase();
      filteredExpenses = filteredExpenses.filter(
        (exp) =>
          exp.from.toLowerCase().includes(search) ||
          exp.to.toLowerCase().includes(search) ||
          exp.notes.toLowerCase().includes(search)
      );
    }

    // Sort expenses
    if (params.sortBy) {
      const [field, direction] = params.sortBy.split(":");
      filteredExpenses.sort((a, b) => {
        let comparison = 0;

        if (field === "date") {
          comparison = new Date(a.date) - new Date(b.date);
        } else if (field === "amount") {
          comparison = a.amount - b.amount;
        } else if (field === "distance") {
          comparison = a.distance - b.distance;
        }

        return direction === "desc" ? -comparison : comparison;
      });
    }

    // Calculate total amount
    const totalAmount = filteredExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Paginate results
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = filteredExpenses.slice(startIndex, endIndex);

    return {
      results: paginatedResults,
      page,
      limit,
      totalPages: Math.ceil(filteredExpenses.length / limit),
      totalResults: filteredExpenses.length,
      totalAmount,
    };
  };

  const handleApplyFilters = () => {
    setPagination({ ...pagination, page: 1 }); // Reset to first page when applying filters
    fetchExpenses(true);
  };

  const handleResetFilters = () => {
    setDateRange({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
    });
    setMinAmount("");
    setMaxAmount("");
    setMinDistance("");
    setMaxDistance("");
    setLocations("");
    setSelectedCategories([]);
    setSearchTerm("");
    setPagination({ ...pagination, page: 1 });

    // Fetch without filters
    fetchExpenses(false);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSortChange = (field) => {
    setSortDirection((prev) =>
      field === sortField ? (prev === "asc" ? "desc" : "asc") : "desc"
    );
    setSortField(field);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleExport = (format) => {
    alert(`Exporting filtered expenses as ${format}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FaFilter className="mr-2" /> Advanced Filtered Expenses
          </h1>
          <p className="text-gray-600">
            API Endpoint: <code>/api/v1/advanced-reports/expenses</code>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <FaFileExport className="mr-2" /> Export PDF
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <FaFileExport className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <FaFilter className="mr-2" /> Filter Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date) =>
                    setDateRange((prev) => ({ ...prev, startDate: date }))
                  }
                  selectsStart
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  className="w-full p-2 border rounded-md"
                  dateFormat="yyyy-MM-dd"
                />
                <div className="absolute top-2 right-2 pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
              <span>to</span>
              <div className="relative flex-1">
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date) =>
                    setDateRange((prev) => ({ ...prev, endDate: date }))
                  }
                  selectsEnd
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  minDate={dateRange.startDate}
                  className="w-full p-2 border rounded-md"
                  dateFormat="yyyy-MM-dd"
                />
                <div className="absolute top-2 right-2 pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Range (CHF)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Min"
                className="w-full p-2 border rounded-md"
              />
              <span>to</span>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Max"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Distance Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance Range (km)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minDistance}
                onChange={(e) => setMinDistance(e.target.value)}
                placeholder="Min"
                className="w-full p-2 border rounded-md"
              />
              <span>to</span>
              <input
                type="number"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                placeholder="Max"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locations (comma separated)
            </label>
            <input
              type="text"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              placeholder="e.g. Zürich, Bern"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Text Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Term
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in notes, locations..."
                className="w-full p-2 pl-10 border rounded-md"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category.id)
                      ? "bg-blue-100 border-blue-500 border text-blue-700"
                      : "bg-gray-100 border-gray-200 border text-gray-700"
                  }`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Filtered Expenses ({pagination.totalResults})
              </h2>
              <div className="text-lg font-medium text-blue-600">
                Total: CHF {totalExpenses.toFixed(2)}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2">
                      <button
                        className="font-medium flex items-center"
                        onClick={() => handleSortChange("date")}
                      >
                        Date
                        {sortField === "date" &&
                          (sortDirection === "desc" ? (
                            <FaSortAmountDown className="ml-1" />
                          ) : (
                            <FaSortAmountUp className="ml-1" />
                          ))}
                      </button>
                    </th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2">
                      <button
                        className="font-medium flex items-center"
                        onClick={() => handleSortChange("distance")}
                      >
                        Distance
                        {sortField === "distance" &&
                          (sortDirection === "desc" ? (
                            <FaSortAmountDown className="ml-1" />
                          ) : (
                            <FaSortAmountUp className="ml-1" />
                          ))}
                      </button>
                    </th>
                    <th className="px-4 py-2">
                      <button
                        className="font-medium flex items-center"
                        onClick={() => handleSortChange("amount")}
                      >
                        Amount
                        {sortField === "amount" &&
                          (sortDirection === "desc" ? (
                            <FaSortAmountDown className="ml-1" />
                          ) : (
                            <FaSortAmountUp className="ml-1" />
                          ))}
                      </button>
                    </th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{formatDate(expense.date)}</td>
                      <td className="px-4 py-3">{expense.from}</td>
                      <td className="px-4 py-3">{expense.to}</td>
                      <td className="px-4 py-3">
                        {expense.distance.toFixed(1)} km
                      </td>
                      <td className="px-4 py-3 font-medium">
                        CHF {expense.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: expense.category.color }}
                          ></span>
                          {expense.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                            expense.status === "approved"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {expense.status.charAt(0).toUpperCase() +
                            expense.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.totalResults
                  )}{" "}
                  of {pagination.totalResults} results
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-1 rounded ${
                      pagination.page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-1 rounded ${
                      pagination.page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Prev
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      // Show 5 page buttons centered around current page
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        const leftOffset = Math.min(2, pagination.page - 1);
                        pageNum = pagination.page - leftOffset + i;
                        if (pageNum > pagination.totalPages) {
                          pageNum = pagination.totalPages - (4 - i);
                        }
                        if (pageNum < 1) pageNum = i + 1;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded ${
                            pagination.page === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-3 py-1 rounded ${
                      pagination.page === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-3 py-1 rounded ${
                      pagination.page === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedFilteredExpenses;
