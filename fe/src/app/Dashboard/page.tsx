"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "./Dashboard.module.css"; // Create this file for your styles

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1); // State to track the current page

  // Example of some dummy statistics data
  const panelsPerPage = 3; // Number of panels to show per page
  const panels = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Statistic ${index + 1}`,
    value: Math.floor(Math.random() * 1000),
  }));

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;

  // Get the panels for the current page
  const currentPanels = panels.slice((page - 1) * panelsPerPage, page * panelsPerPage);

  // Handle "Next Page" button click
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className={styles.dashboardPage}>
      <Container className={styles.mainContent}>
        <div className={styles.panelRow}>
          {currentPanels.map((panel) => (
            <div key={panel.id} className={styles.panel}>
              <h3>{panel.title}</h3>
              <p>{panel.value}</p>
            </div>
          ))}
        </div>
        {/* Next page button */}
        {page * panelsPerPage < panels.length && (
          <button className={styles.loadMoreBtn} onClick={handleNextPage}>
            Load More Statistics
          </button>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
