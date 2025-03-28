import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaChartPie,
  FaChartLine,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaCalendarAlt,
  FaSearchDollar,
  FaBalanceScale,
  FaMoneyBillWave,
  FaChartBar,
} from "react-icons/fa";

const Reports = () => {
  return (
    <Container className="my-4">
      <h2 className="mb-4">Reports & Analytics</h2>

      <Row>
        <Col lg={4} md={6} className="mb-4">
          <Link to="/reports/ytd" className="text-decoration-none">
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaCalendarAlt size={40} className="text-primary" />
                </div>
                <Card.Title>Year-to-Date Reports</Card.Title>
                <Card.Text className="text-muted">
                  View comprehensive year-to-date expense reports with previous
                  year comparison
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Link to="/reports/chart-data" className="text-decoration-none">
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaChartPie size={40} className="text-success" />
                </div>
                <Card.Title>Chart Data</Card.Title>
                <Card.Text className="text-muted">
                  Visualize expenses data with customizable charts (pie, bar,
                  line)
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Link to="/reports/forecast" className="text-decoration-none">
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaChartLine size={40} className="text-info" />
                </div>
                <Card.Title>Expense Forecasting</Card.Title>
                <Card.Text className="text-muted">
                  Predict future expenses based on historical data with
                  different forecasting methods
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Link
            to="/reports/budget-comparison"
            className="text-decoration-none"
          >
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaBalanceScale size={40} className="text-warning" />
                </div>
                <Card.Title>Budget Comparison</Card.Title>
                <Card.Text className="text-muted">
                  Compare budgeted vs. actual expenses by category for any
                  period
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Link
            to="/reports/advanced-expenses"
            className="text-decoration-none"
          >
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaSearchDollar size={40} className="text-danger" />
                </div>
                <Card.Title>Advanced Filtered Expenses</Card.Title>
                <Card.Text className="text-muted">
                  Search and filter expenses with multiple customizable criteria
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Link to="/analytics" className="text-decoration-none">
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaFileAlt size={40} className="text-secondary" />
                </div>
                <Card.Title>General Analytics</Card.Title>
                <Card.Text className="text-muted">
                  Access comprehensive analytics dashboard for overview and
                  insights
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <h2 className="mt-5 mb-4">Budget Management</h2>

      <Row>
        <Col lg={4} md={6} className="mb-4">
          <Link to="/budgets" className="text-decoration-none">
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaMoneyBillWave size={40} className="text-success" />
                </div>
                <Card.Title>Budgets List</Card.Title>
                <Card.Text className="text-muted">
                  View, create, edit and delete budgets for different categories
                  and periods
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Link to="/budgets/summary" className="text-decoration-none">
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaChartBar size={40} className="text-primary" />
                </div>
                <Card.Title>Budget Summary</Card.Title>
                <Card.Text className="text-muted">
                  See yearly budget summary with monthly and category breakdowns
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Link to="/budgets/create" className="text-decoration-none">
            <Card className="h-100 hover-card">
              <Card.Body className="d-flex flex-column align-items-center text-center py-4">
                <div className="icon-container mb-3">
                  <FaFileInvoiceDollar size={40} className="text-info" />
                </div>
                <Card.Title>Create New Budget</Card.Title>
                <Card.Text className="text-muted">
                  Set up new budgets for categories and time periods
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <style jsx="true">{`
        .hover-card {
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Container>
  );
};

export default Reports;
