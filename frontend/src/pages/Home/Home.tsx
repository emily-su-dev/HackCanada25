import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/cybersecurityBackground.png"; // Import image
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Container className="text-center home-container">
        <h1 className="home-title">Cybersecurity Awareness Training</h1>
        <p className="home-subtitle">
          Prevent phishing for once and all.
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          className="create-account-btn"
          onClick={() => navigate("/signup")}
        >
          Create Account
        </Button>
        <p className="signin-text mt-3">
          Have an account? <span onClick={() => navigate("/signin")} className="signin-link">Sign in</span>
        </p>
      </Container>
    </div>
  );
};

export default Home;
