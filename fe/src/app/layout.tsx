'use client';
import localFont from 'next/font/local';
import { usePathname } from 'next/navigation'; // For current path
import Sidebar from './components/Sidebar'; // Import the Sidebar component
import './globals.css';
import Providers from './providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current path

  const showSidebar =
    pathname === '/Dashboard' || pathname === '/Configuration';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div style={{ display: 'flex' }}>
          {showSidebar && <Sidebar />}{' '}
          {/* Show Sidebar only on Dashboard/Configuration */}
          <div
            style={{ marginLeft: showSidebar ? '250px' : '0', width: '100%' }}
          >
            <Providers>
              {children} {/* Main content */}
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
