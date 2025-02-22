"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import styles from "./Home.module.css";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;  // Ensure that the page is only rendered on the client

  const handleCreateAccountClick = () => {
    router.push("/SignUp");  // Navigate to the signup page
  };

  const handleSignInClick = () => {
    router.push("/SignIn");
  };

  return (
    <div className={styles.home}>
      <Container className="text-center">
        <h1 className={styles.homeTitle}>Cybersecurity Awareness Training</h1>
        <p className={styles.homeSubtitle}>
          Prevent phishing for once and all.
        </p>
        <Button
          variant="primary"
          size="lg"
          className={styles.createAccountBtn}
          onClick={handleCreateAccountClick} // Handle navigation
        >
          Create Account
        </Button>
        <p className={styles.signinText + " mt-3"}>
          Have an account?{" "}
          <span className={styles.signinLink} onClick={() => router.push("/SignIn")}>
            Sign in
          </span>
        </p>
      </Container>
    </div>
  );
};

export default Home;
