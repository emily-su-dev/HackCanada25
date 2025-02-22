"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from "./SignUp.module.css";
import { AuthenticateButton } from '../components/AuthenticateButton';


const SignUp = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;

  return (
    <div className={styles.authPage}>
      <Container className={styles.authContainer}>
        <h2 className={styles.authTitle}>Create Accounts</h2>
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
            Sign Up
          </Button>
        </Form>

        <p className={styles.authFooter}>
          Already have an account?{" "}
          <span className={styles.authLink} onClick={() => router.push("/SignIn")}>
            Sign in
          </span>
          <AuthenticateButton />
        </p>
      </Container>
    </div>
  );
};

export default SignUp;
