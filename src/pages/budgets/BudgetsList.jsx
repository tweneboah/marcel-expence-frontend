import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/apiConfig";
import {
  Card,
  Container,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const BudgetsList = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const response = await API.get(
          `/budgets?page=${currentPage}&limit=10&sort=-year,-month`
        );

        if (response.data && response.data.data) {
          setBudgets(response.data.data);
          setTotalPages(Math.ceil(response.data.count / 10));
          setError(null);
        } else {
          setBudgets([]);
          setError("No budget data received from server");
        }
      } catch (err) {
        console.error("Error fetching budgets:", err);
        setError(err.response?.data?.message || "Failed to fetch budgets");
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await API.delete(`/budgets/${id}`);
        setBudgets(budgets.filter((budget) => budget._id !== id));
      } catch (err) {
        console.error("Error deleting budget:", err);
        setError(err.response?.data?.message || "Failed to delete budget");
      }
    }
  };

  const getBudgetStatusBadge = (usage) => {
    if (!usage) return <Badge bg="secondary">No data</Badge>;

    if (usage.status === "under")
      return <Badge bg="success">Under Budget</Badge>;
    if (usage.status === "warning") return <Badge bg="warning">Warning</Badge>;
    if (usage.status === "critical") return <Badge bg="danger">Critical</Badge>;
    return <Badge bg="info">No status</Badge>;
  };

  if (loading && budgets.length === 0) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Budgets Management</h3>
          <Link to="/admin/budgets/create">
            <Button variant="primary">
              <FaPlus className="me-2" /> New Budget
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mb-3">
            <Link to="/admin/budgets/summary" className="btn btn-info">
              View Budget Summary
            </Link>
          </div>

          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Period</th>
                <th>Category</th>
                <th>Budget (CHF)</th>
                <th>Used (CHF)</th>
                <th>Remaining (CHF)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">
                    No budgets found. Create a new budget to get started.
                  </td>
                </tr>
              ) : (
                budgets.map((budget) => (
                  <tr key={budget._id}>
                    <td>
                      {budget.periodName || `${budget.month}/${budget.year}`}
                    </td>
                    <td>
                      <span
                        className="color-dot"
                        style={{
                          backgroundColor: budget.category?.color || "#999",
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          marginRight: "8px",
                        }}
                      ></span>
                      {budget.category?.name || "N/A"}
                    </td>
                    <td>{budget.amount?.toFixed(2) || "0.00"}</td>
                    <td>
                      {budget.usage?.totalCost
                        ? budget.usage.totalCost.toFixed(2)
                        : "0.00"}
                    </td>
                    <td>
                      {budget.usage?.remaining
                        ? budget.usage.remaining.toFixed(2)
                        : budget.amount?.toFixed(2) || "0.00"}
                    </td>
                    <td>{getBudgetStatusBadge(budget.usage)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/admin/budgets/${budget._id}`}
                          className="btn btn-sm btn-info"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/budgets/edit/${budget._id}`}
                          className="btn btn-sm btn-warning"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(budget._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="me-2"
              >
                Previous
              </Button>
              <span className="mx-3 align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BudgetsList;
