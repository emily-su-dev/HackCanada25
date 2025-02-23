"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import styles from "./Home.module.css";
import { AuthenticateButton } from './components/AuthenticateButton';
import Image from "next/image";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [moved, setMoved] = useState(false);

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;  // Ensure that the page is only rendered on the client

  return (
    <div className={styles.home}>
      <Container className="text-center">
        <div className={styles.logoContainer}>
          <Image
            src="/assets/sinkerLogo.png"
            alt="Sinker Logo"
            className={`${styles.logo} ${moved ? styles.movedUp : ""}`} 
            onClick={() => setMoved(!moved)}
            width={150}
            height={150}
          /> 
        </div>

        <h1 
        className={`${styles.sinkerTitle} ${moved ? styles.movedUp : ""}`} // Toggle class
        onClick={() => setMoved(!moved)}>
          Sinker
        </h1>

        <h1 
        className={styles.homeTitle}>
          Cybersecurity Awareness Training
        </h1>
        <p className={styles.homeSubtitle}>
          Prevent phishing for once and all.
        </p>
        
        <AuthenticateButton />
      </Container>
    </div>
  );
};

export default Home;

