import { Container } from "react-bootstrap";
import "./Dashboard.css"; // Or Dashboard.css

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="toolbar">Dashboard</div>
      <Container className="main-content">
        <h1>Dashboard</h1>
        <p>Set up your phishing simulation settings here.</p>
      </Container>
    </div>
  );
};

export default Dashboard;
