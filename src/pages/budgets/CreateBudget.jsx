import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/apiConfig";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaPlus,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateBudget = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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
    const fetchCategories = async () => {
      try {
        const response = await API.get("/categories");
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        } else {
          setError("No categories found. Please create a category first.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.post("/budgets", formData);
      if (response.data && response.data.success) {
        navigate(`/admin/budgets/${response.data.data._id}`);
      } else {
        setError("Failed to create budget. Please try again.");
      }
    } catch (err) {
      console.error("Error creating budget:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create budget. Please try again."
      );
      setIsLoading(false);
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
    <Container className="my-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link
              to="/admin/budgets"
              className="btn btn-outline-secondary me-3"
            >
              <FaArrowLeft /> Back to Budgets
            </Link>
            <h3 className="mb-0">Create New Budget</h3>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {generateYearOptions()}
                  </select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Month</Form.Label>
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
                    Select "Annual Budget" for a yearly budget instead of
                    monthly
                  </p>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
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
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Budget Amount (CHF)</Form.Label>
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
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Maximum Distance (km)</Form.Label>
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
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Warning Threshold (%)</Form.Label>
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
                    shown (default: 75%)
                  </p>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Critical Threshold (%)</Form.Label>
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
                    will be shown (default: 90%)
                  </p>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <Form.Group className="mb-4">
              <Form.Label>Notes</Form.Label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes or comments about this budget"
                rows="3"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                as={Link}
                to="/admin/budgets"
              >
                <FaTimes className="mr-2" /> Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Create Budget
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateBudget;
