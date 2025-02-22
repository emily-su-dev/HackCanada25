"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./Dashboard.module.css"; // Create this file for your styles

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.toolbar}>Dashboard</div>
      <Container className={styles.mainContent}>
        <h1>Dashboard</h1>
        <p>Set up your phishing simulation settings here.</p>
      </Container>
    </div>
  );
};

export default Dashboard;
