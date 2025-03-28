import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getExpenseCategories } from "../../api/expenseApi";
import Button from "../../components/ui/Button";
import CategorySummary from "./CategorySummary";
import {
  FiPlusCircle,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
  FiSliders,
  FiX,
  FiBarChart2,
} from "react-icons/fi";

// Simplified category card with minimal styling
const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      <h3>{category.name}</h3>
      {category.description && <p>{category.description}</p>}
      <div>{category.isActive ? "Active" : "Inactive"}</div>
      {category.expenseCount !== undefined && (
        <div>Expenses: {category.expenseCount}</div>
      )}
      <div style={{ marginTop: "10px" }}>
        <Link to={`/admin/categories/${category._id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  );
};

// Notification component
const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-700";
  const Icon = type === "success" ? FiCheckCircle : FiAlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg border ${bgColor} shadow-lg max-w-sm flex items-start`}
    >
      <Icon className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">{message}</div>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <FiXCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

// Filter component
const CategoryFilter = ({
  filters,
  setFilters,
  applyFilters,
  resetFilters,
  className = "",
}) => {
  const periods = [
    { value: "", label: "All Time" },
    { value: "current-month", label: "Current Month" },
    { value: "current-quarter", label: "Current Quarter" },
    { value: "current-year", label: "Current Year" },
    { value: "last-month", label: "Last Month" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "last-year", label: "Last Year" },
  ];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
    { value: "createdAt", label: "Created (Oldest)" },
    { value: "-createdAt", label: "Created (Newest)" },
    { value: "-expenseCount", label: "Most Used" },
    { value: "expenseCount", label: "Least Used" },
  ];

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow mb-6 border border-gray-200 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Filter Categories</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-gray-500 flex items-center hover:text-gray-700"
        >
          <FiRefreshCw className="mr-1 h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Category name..."
              className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-[#FCA311] focus:border-[#FCA311]"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.isActive === undefined ? "" : filters.isActive}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                isActive: value === "" ? undefined : value === "true",
              });
            }}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#FCA311] focus:border-[#FCA311]"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Period filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <select
            value={filters.period || ""}
            onChange={(e) =>
              setFilters({ ...filters, period: e.target.value || undefined })
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#FCA311] focus:border-[#FCA311]"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sort || "name"}
            onChange={(e) =>
              setFilters({ ...filters, sort: e.target.value || undefined })
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#FCA311] focus:border-[#FCA311]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Has Budget filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget
          </label>
          <select
            value={filters.hasBudget === undefined ? "" : filters.hasBudget}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                hasBudget: value === "" ? undefined : value === "true",
              });
            }}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#FCA311] focus:border-[#FCA311]"
          >
            <option value="">All</option>
            <option value="true">Has Budget</option>
            <option value="false">No Budget</option>
          </select>
        </div>

        {/* Usage threshold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usage Above (%)
          </label>
          <input
            type="number"
            value={filters.usageAbove || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                usageAbove: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="e.g. 80"
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-[#FCA311] focus:border-[#FCA311]"
          />
        </div>

        {/* Include expense counts */}
        <div className="flex items-end">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={filters.includeExpenseCounts === true}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  includeExpenseCounts: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-[#FCA311] focus:ring-[#FCA311]"
            />
            <span className="ml-2 text-sm text-gray-700">
              Show expense counts
            </span>
          </label>
        </div>

        {/* Compare with previous period */}
        <div className="flex items-end">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={filters.compareWithPrevious === true}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  compareWithPrevious: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-[#FCA311] focus:ring-[#FCA311]"
            />
            <span className="ml-2 text-sm text-gray-700">
              Compare with previous
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={applyFilters}
          className="bg-[#FCA311] hover:bg-[#FCA311]/90"
        >
          <FiFilter className="mr-2" /> Apply Filters
        </Button>
      </div>
    </div>
  );
};

// Pagination component
const Pagination = ({ pagination, onPageChange, page }) => {
  const { totalPages, totalCount } = pagination || {
    totalPages: 1,
    totalCount: 0,
  };
  const currentPage = Number(page) || 1;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm mt-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span> (
            <span className="font-medium">{totalCount}</span> total categories)
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className="sr-only">Previous</span>
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show 5 pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    pageNum === currentPage
                      ? "z-10 bg-[#FCA311] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCA311]"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const CategoryList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [showSummary, setShowSummary] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "name",
    search: "",
    isActive: undefined,
    hasBudget: undefined,
    period: "",
    usageAbove: undefined,
    includeExpenseCounts: true,
    compareWithPrevious: false,
  });

  // Applied filters state (only update when apply button is clicked)
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  useEffect(() => {
    // Check if there's a notification from navigation state
    if (location.state?.notification) {
      setNotification(location.state.notification);
      // Clear the state to prevent showing notification on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Call the API with filters
        const result = await getExpenseCategories(appliedFilters);

        // Set categories and pagination info
        setCategories(result.categories || []);
        setPagination({
          totalPages: result.pagination?.totalPages || 1,
          totalCount: result.totalCount || 0,
          currentPage: appliedFilters.page || 1,
        });
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [appliedFilters]);

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...appliedFilters, page: newPage };
    setAppliedFilters(updatedFilters);
    setFilters(updatedFilters);
  };

  const applyFilters = () => {
    // Reset to page 1 when applying new filters
    setAppliedFilters({ ...filters, page: 1 });
  };

  const resetFilters = () => {
    const defaultFilters = {
      page: 1,
      limit: 10,
      sort: "name",
      search: "",
      isActive: undefined,
      hasBudget: undefined,
      period: "",
      usageAbove: undefined,
      includeExpenseCounts: true,
      compareWithPrevious: false,
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14213D]">
            Expense Categories
          </h1>
          <p className="text-gray-600">
            Manage your expense categories and budget limits
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowSummary(!showSummary)}
            variant="secondary"
            className="flex items-center"
          >
            {showSummary ? (
              <FiX className="mr-2" />
            ) : (
              <FiBarChart2 className="mr-2" />
            )}
            {showSummary ? "Hide Summary" : "Show Summary"}
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            className="flex items-center"
          >
            {showFilters ? (
              <FiX className="mr-2" />
            ) : (
              <FiSliders className="mr-2" />
            )}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Link to="/admin/categories/create">
            <Button className="bg-[#FCA311] hover:bg-[#FCA311]/90">
              <FiPlusCircle className="mr-2" /> Create Category
            </Button>
          </Link>
        </div>
      </div>

      {showSummary && <CategorySummary />}

      {showFilters && (
        <CategoryFilter
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FCA311]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
          <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mx-auto bg-[#FCA311]/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-4">
            <FiFilter className="h-12 w-12 text-[#FCA311]" />
          </div>
          <h2 className="text-xl font-medium text-[#14213D] mb-2">
            No Categories Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {appliedFilters.search ||
            appliedFilters.isActive !== undefined ||
            appliedFilters.hasBudget !== undefined
              ? "No categories match your current filters. Try adjusting your filters or create a new category."
              : "You haven't created any expense categories yet. Create your first category to start organizing your expenses."}
          </p>
          {appliedFilters.search ||
          appliedFilters.isActive !== undefined ||
          appliedFilters.hasBudget !== undefined ? (
            <Button onClick={resetFilters} variant="secondary" className="mr-2">
              <FiRefreshCw className="mr-2" /> Reset Filters
            </Button>
          ) : null}
          <Link to="/admin/categories/create">
            <Button className="bg-[#FCA311] hover:bg-[#FCA311]/90">
              <FiPlusCircle className="mr-2" /> Create Category
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              pagination={pagination}
              page={appliedFilters.page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryList;
