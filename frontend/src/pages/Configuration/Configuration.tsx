import { LayoutDashboard, LogOut, Settings } from "lucide-react"; // Import icons
import { Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Configuration.css";

const Configuration = () => {
  return (
    <div className="config-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">PhishPerception</h2>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} className="nav-icon" /> Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/configuration" className="nav-item">
            <Settings size={20} className="nav-icon" /> Configuration
          </Nav.Link>
          <Nav.Link as={Link} to="/" className="nav-item logout">
            <LogOut size={20} className="nav-icon" /> Log Out
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <Container className="content">
        <h1>Configuration Page</h1>
        <p>Set up your phishing simulation settings here.</p>
      </Container>
    </div>
  );
};

export default Configuration;
