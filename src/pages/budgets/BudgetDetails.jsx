import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Table,
  ProgressBar,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaChartPie,
  FaExclamationTriangle,
} from "react-icons/fa";

const BudgetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchBudgetDetails();
  }, [id]);

  const fetchBudgetDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/v1/budgets/${id}`);
      setBudget(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch budget details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/budgets/${id}`);
      navigate("/budgets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete budget");
      setShowDeleteModal(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(amount);
  };

  const calculateUsagePercentage = (spent, allocated) => {
    if (allocated === 0) return 0;
    return Math.min(Math.round((spent / allocated) * 100), 100);
  };

  const getProgressVariant = (percentage) => {
    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    return "primary";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading budget details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <div className="alert alert-danger">
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
        <Link to="/budgets" className="btn btn-primary">
          <FaArrowLeft className="me-2" /> Back to Budgets
        </Link>
      </Container>
    );
  }

  if (!budget) {
    return (
      <Container className="my-4">
        <div className="alert alert-warning">
          <FaExclamationTriangle className="me-2" />
          Budget not found
        </div>
        <Link to="/budgets" className="btn btn-primary">
          <FaArrowLeft className="me-2" /> Back to Budgets
        </Link>
      </Container>
    );
  }

  const totalAllocated = budget.categories.reduce(
    (sum, cat) => sum + cat.allocatedAmount,
    0
  );
  const totalSpent = budget.categories.reduce(
    (sum, cat) => sum + cat.spentAmount,
    0
  );
  const overallUsagePercentage = calculateUsagePercentage(
    totalSpent,
    totalAllocated
  );

  return (
    <Container className="my-4">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to="/budgets" className="btn btn-outline-secondary me-3">
              <FaArrowLeft /> Back to Budgets
            </Link>
            <h3 className="mb-0">{budget.name}</h3>
            <Badge
              bg={
                budget.status === "active"
                  ? "success"
                  : budget.status === "completed"
                  ? "secondary"
                  : "warning"
              }
              className="ms-3"
            >
              {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
            </Badge>
          </div>
          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              as={Link}
              to={`/budgets/edit/${id}`}
            >
              <FaEdit className="me-1" /> Edit Budget
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrash className="me-1" /> Delete
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="card-title">Budget Details</h5>
                  <div className="mt-3">
                    <p>
                      <strong>Description:</strong>{" "}
                      {budget.description || "No description provided"}
                    </p>
                    <p>
                      <strong>Period:</strong> {budget.period}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {formatDate(budget.startDate)}
                    </p>
                    <p>
                      <strong>End Date:</strong> {formatDate(budget.endDate)}
                    </p>
                    <p>
                      <strong>Created On:</strong>{" "}
                      {formatDate(budget.createdAt)}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title">Budget Summary</h5>
                  <div className="mt-3 flex-grow-1">
                    <p>
                      <strong>Total Allocated:</strong>{" "}
                      {formatCurrency(totalAllocated)}
                    </p>
                    <p>
                      <strong>Total Spent:</strong> {formatCurrency(totalSpent)}
                    </p>
                    <p>
                      <strong>Remaining:</strong>{" "}
                      {formatCurrency(totalAllocated - totalSpent)}
                    </p>

                    <div className="mt-4">
                      <div className="d-flex justify-content-between mb-1">
                        <div>Overall Budget Usage</div>
                        <div>{overallUsagePercentage}%</div>
                      </div>
                      <ProgressBar
                        variant={getProgressVariant(overallUsagePercentage)}
                        now={overallUsagePercentage}
                        className="mb-3"
                      />
                    </div>
                  </div>
                  <div className="mt-auto text-center">
                    <Button
                      variant="outline-primary"
                      as={Link}
                      to={`/reports/budget-comparison?budgetId=${id}`}
                      className="w-100"
                    >
                      <FaChartPie className="me-1" /> View Budget Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="card-title">Status Overview</h5>
                  <div className="mt-3">
                    {budget.categories.some(
                      (cat) =>
                        calculateUsagePercentage(
                          cat.spentAmount,
                          cat.allocatedAmount
                        ) >= 90
                    ) && (
                      <div className="alert alert-danger">
                        <FaExclamationTriangle className="me-2" />
                        Some categories have exceeded or are near their budget
                        limits!
                      </div>
                    )}

                    <p>
                      <strong>Budget Health:</strong>
                      {overallUsagePercentage >= 90 ? (
                        <Badge bg="danger" className="ms-2">
                          Critical
                        </Badge>
                      ) : overallUsagePercentage >= 75 ? (
                        <Badge bg="warning" className="ms-2">
                          Warning
                        </Badge>
                      ) : (
                        <Badge bg="success" className="ms-2">
                          Good
                        </Badge>
                      )}
                    </p>

                    <p>
                      <strong>Days Remaining:</strong>{" "}
                      {Math.max(
                        0,
                        Math.round(
                          (new Date(budget.endDate) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      days
                    </p>

                    <p>
                      <strong>Spending Trend:</strong>{" "}
                      {budget.spendingTrend === "increasing" ? (
                        <span className="text-danger">Increasing ↗</span>
                      ) : budget.spendingTrend === "decreasing" ? (
                        <span className="text-success">Decreasing ↘</span>
                      ) : (
                        <span className="text-info">Stable →</span>
                      )}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">Budget Categories</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Category</th>
                    <th>Allocated (CHF)</th>
                    <th>Spent (CHF)</th>
                    <th>Remaining (CHF)</th>
                    <th>Usage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.categories.map((category) => {
                    const usagePercentage = calculateUsagePercentage(
                      category.spentAmount,
                      category.allocatedAmount
                    );
                    const isOverBudget =
                      category.spentAmount > category.allocatedAmount;
                    const remaining =
                      category.allocatedAmount - category.spentAmount;

                    return (
                      <tr key={category._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <span
                              style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor:
                                  category.category?.color || "#999",
                                display: "inline-block",
                                marginRight: "8px",
                                borderRadius: "50%",
                              }}
                            ></span>
                            {category.category
                              ? category.category.name
                              : category.categoryName || "Uncategorized"}
                          </div>
                        </td>
                        <td>{formatCurrency(category.allocatedAmount)}</td>
                        <td>{formatCurrency(category.spentAmount)}</td>
                        <td>
                          <span
                            className={
                              remaining < 0 ? "text-danger" : "text-success"
                            }
                          >
                            {formatCurrency(remaining)}
                          </span>
                        </td>
                        <td style={{ width: "20%" }}>
                          <div className="d-flex justify-content-between mb-1">
                            <small>{usagePercentage}%</small>
                          </div>
                          <ProgressBar
                            variant={getProgressVariant(usagePercentage)}
                            now={usagePercentage}
                          />
                        </td>
                        <td>
                          <Badge
                            bg={
                              isOverBudget
                                ? "danger"
                                : usagePercentage >= 75
                                ? "warning"
                                : "success"
                            }
                          >
                            {isOverBudget
                              ? "Over Budget"
                              : usagePercentage >= 75
                              ? "Warning"
                              : "On Track"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {budget.notes && (
            <Card className="mt-4">
              <Card.Header>
                <h5 className="mb-0">Notes</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{budget.notes}</p>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the budget "{budget.name}"? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Budget
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BudgetDetails;
