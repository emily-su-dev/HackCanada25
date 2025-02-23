"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
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
      <div className = {styles.configurationTitle}>
            <h1>Configuration</h1>
        </div>

    </div>
  );
};

export default Configuration;
