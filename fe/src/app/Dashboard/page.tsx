'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Importing both arrow icons
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css'; // Create this file for your styles
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0); // State to track the current page
  const [panelsPerPage, setPanelsPerPage] = useState(3); // State to set how many panels per page dynamically
  const [accountId, setAccountId] = useState(null); // State to store accountId
  const [accountData, setAccountData] = useState(null); // State to store account data

  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchAccountId = async () => {
        try {
          const getResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/email/${session.user.email}`,
            { method: 'GET' }
          );
          const getData = await getResponse.json();

          console.log('GET Response:', getResponse); // Debug log
          console.log('GET Data:', getData); // Debug log

          if (getData && getData.id) {
            console.log('Account found:', getData.id);
            setAccountId(getData.id);
          } else {
            console.log('No account found, creating a new one...');
            const postResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session.user.email }),
              }
            );
            const postData = await postResponse.json();
            setAccountId(postData.id);
          }
        } catch (error) {
          console.error('Error checking or creating account:', error);
        }
      };

      fetchAccountId();
    }
  }, [session]);

  useEffect(() => {
    if (accountId) {
      const fetchAccountData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employee?accountId=${accountId}`,
            { method: 'GET' }
          );
          const data = await response.json();
          setAccountData(data);
          console.log('Account Data:', data); // Debug log
        } catch (error) {
          console.error('Error fetching account data:', error);
        }
      };

      fetchAccountData();
    }
  }, [accountId]);

  // Example of some dummy statistics data
  const panels = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Statistic ${index + 1}`,
    value: Math.floor(Math.random() * 1000),
  }));

  // Fix hydration error by ensuring this runs only on the client
  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1200) {
        setPanelsPerPage(3); // 3 panels for large screens
      } else if (width > 768) {
        setPanelsPerPage(2); // 2 panels for medium screens
      } else {
        setPanelsPerPage(1); // 1 panel for small screens
      }
    };

    // Initial resize check
    handleResize();
    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent rendering mismatched HTML between server and client
  if (!mounted) return null;

  // Get the panels to show based on the current page (show 3 panels per page)
  const currentPanels = panels.slice(
    page * panelsPerPage,
    (page + 1) * panelsPerPage
  ); // Get the panels for the current page

  // Handle "Next Page" button click (scroll one block to the right)
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Handle "Previous Page" button click (scroll one block to the left)
  const handlePrevPage = () => {
    setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardTitle}>
        <h1>Phishing Test Statistics</h1>
      </div>

      <div className={styles.panelRow}>
        {currentPanels.map((panel) => (
          <div key={panel.id} className={styles.panel}>
            <h3>{panel.title}</h3>
            <p>{panel.value}</p>
          </div>
        ))}
      </div>

      {/* Left and Right arrow buttons */}
      <button
        className={`${styles.arrowBtn} ${styles['arrowBtnLeft']}`}
        onClick={handlePrevPage}
        disabled={page === 0} // Disable if we're on the first page
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className={`${styles.arrowBtn} ${styles['arrowBtnRight']}`}
        onClick={handleNextPage}
        disabled={page >= Math.floor(panels.length / panelsPerPage)} // Disable if we're on the last page
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Dashboard;
