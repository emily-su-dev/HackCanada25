"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./Configuration.module.css"; // Make sure to create this file

const Configuration = () => {
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;

  return (
    <div className={styles.configurationPage}>
      <div className={styles.toolbar}>Configuration</div>
      <Container className={styles.mainContent}>
        <h1>Configuration</h1>
        <p>Set up your phishing simulation settings here.</p>
      </Container>
    </div>
  );
};

export default Configuration;
