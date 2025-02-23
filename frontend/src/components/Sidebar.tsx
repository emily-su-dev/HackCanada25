import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation(); // Get the current page path

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">PhishPerception</h2>
      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/dashboard"
          className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <LayoutDashboard size={20} className="nav-icon" /> Dashboard
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/configuration"
          className={`nav-item ${location.pathname === "/configuration" ? "active" : ""}`}
        >
          <Settings size={20} className="nav-icon" /> Configuration
        </Nav.Link>
        <Nav.Link as={Link} to="/" className="nav-item logout">
          <LogOut size={20} className="nav-icon" /> Log Out
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
