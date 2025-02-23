import { Container } from "react-bootstrap";
import "./Configuration.css"; // Or Dashboard.css

const Configuration = () => {
  return (
    <div className="configuration-page">
      <div className="toolbar">Configuration</div>
      <Container className="main-content">
        <h1>Configuration</h1>
        <p>Set up your phishing simulation settings here.</p>
      </Container>
    </div>
  );
};

export default Configuration;
