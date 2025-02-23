'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import styles from './Sidebar.module.css'; // Your styles

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Getting the current path
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;

  // Check if the current path matches the nav item
  const activeLink = (path: string) => (pathname === path ? styles.active : '');

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Sinker</h2>
      <Nav className="flex-column">
        <Nav.Link
          className={`${styles.navItem} ${activeLink('/Dashboard')}`}
          onClick={() => router.push('/Dashboard')}
        >
          <LayoutDashboard size={30} className={styles.navIcon} />
          <p>Dashboard</p>
        </Nav.Link>
        <Nav.Link
          className={`${styles.navItem} ${activeLink('/Configuration')}`}
          onClick={() => router.push('/Configuration')}
        >
          <Settings size={30} className={styles.navIcon} />
          <p>Configuration</p>
        </Nav.Link>
        <Nav.Link
          className={`${styles.navItem} ${styles.logout}`}
          onClick={() => router.push('/')} // Adjust logout logic accordingly
        >
          <LogOut size={30} className={styles.navIcon} />
          <p>Log Out</p>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
