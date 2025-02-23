import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <Container className="auth-container">
        <h2 className="auth-title">Sign In</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-4">
            Sign In
          </Button>
        </Form>

        <p className="auth-footer mt-3">
          Don't have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </Container>
    </div>
  );
};

export default SignIn;
