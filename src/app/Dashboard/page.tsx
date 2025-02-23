'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import {
  AlertTriangle,
  Mail,
  PhoneCall,
  MessageSquare,
  Users,
  Percent,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import PieChartComponent from '../components/PieChartComponent';
import BarChartComponent from '../components/BarChartComponent';
import styles from './Dashboard.module.css';

interface CustomSession extends Session {
  user: {
    email: string;
    id: string;
  };
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTests: 0,
    smsFailRate: 0,
    callFailRate: 0,
    emailFailRate: 0,
    pieData: [] as Array<{ name: string; value: number }>,
    distributionData: [] as Array<{ range: string; count: number }>,
  });

  const COLORS = [
    '#94b5e6',
    '#284c82',
    '#95c6c6',
    '#003f5c',
    '#9f90cb',
    '#351d79',
    '#9695b5',
    '#aaa4c2',
  ];

  const { data: session } = useSession();

  // Handle initial mounting and fetch account ID
  useEffect(() => {
    setMounted(true);

    if (session && session.user && session.user.email) {
      const fetchAccountId = async () => {
        try {
          const getResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/email/${(session as unknown as CustomSession).user.email}`,
            { method: 'GET' }
          );
          const getData = await getResponse.json();

          if (getData && getData.id) {
            setAccountId(getData.id);
          } else {
            const postResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: (session as CustomSession).user.email,
                }),
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

  // Fetch employee data when accountId is available
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
        } catch (error) {
          console.error('Error fetching account data:', error);
        }
      };

      fetchAccountData();
    }
  }, [accountId]);

  // Calculate stats when accountData changes
  useEffect(() => {
    if (accountData) {
      // Calculate overall statistics
      const totalEmployees = accountData.length;
      const totalSmsTests = accountData.reduce(
        (sum: number, emp: { numSmsLogs?: number }) =>
          sum + (emp.numSmsLogs || 0),
        0
      );
      const totalCallTests = accountData.reduce(
        (sum: number, emp: { numCallLogs?: number }) =>
          sum + (emp.numCallLogs || 0),
        0
      );
      const totalEmailTests = accountData.reduce(
        (sum: number, emp: { numEmailLogs?: number }) =>
          sum + (emp.numEmailLogs || 0),
        0
      );
      const totalSmsFails = accountData.reduce(
        (sum: number, emp: { numSmsFails?: number }) =>
          sum + (emp.numSmsFails || 0),
        0
      );
      const totalCallFails = accountData.reduce(
        (sum: number, emp: { numCallFails?: number }) =>
          sum + (emp.numCallFails || 0),
        0
      );
      const totalEmailFails = accountData.reduce(
        (sum: number, emp: { numEmailFails?: number }) =>
          sum + (emp.numEmailFails || 0),
        0
      );

      // Calculate fail rates
      const smsFailRate = totalSmsTests
        ? ((totalSmsFails / totalSmsTests) * 100).toFixed(1)
        : 0;
      const callFailRate = totalCallTests
        ? ((totalCallFails / totalCallTests) * 100).toFixed(1)
        : 0;
      const emailFailRate = totalEmailTests
        ? ((totalEmailFails / totalEmailTests) * 100).toFixed(1)
        : 0;

      // Prepare data for pie chart
      const pieData = [
        { name: 'SMS Passes', value: totalSmsTests - totalSmsFails },
        { name: 'SMS Fails', value: totalSmsFails },
        { name: 'Call Passes', value: totalCallTests - totalCallFails },
        { name: 'Call Fails', value: totalCallFails },
        { name: 'Email Passes', value: totalEmailTests - totalEmailFails },
        { name: 'Email Fails', value: totalEmailFails },
      ];

      // Calculate individual employee fail rates and create distribution
      const employeeFailRates = accountData.map(
        (emp: {
          numSmsLogs?: number;
          numCallLogs?: number;
          numEmailLogs?: number;
          numSmsFails?: number;
          numCallFails?: number;
          numEmailFails?: number;
        }) => {
          const totalTests =
            (emp.numSmsLogs || 0) +
            (emp.numCallLogs || 0) +
            (emp.numEmailLogs || 0);
          const totalFails =
            (emp.numSmsFails || 0) +
            (emp.numCallFails || 0) +
            (emp.numEmailFails || 0);
          return totalTests > 0 ? (totalFails / totalTests) * 100 : 0;
        }
      );

      // Create distribution buckets (0-10%, 10-20%, etc.)
      const distribution = new Array(10).fill(0);
      employeeFailRates.forEach((rate: number) => {
        const bucketIndex = Math.min(Math.floor(rate / 10), 9);
        distribution[bucketIndex]++;
      });

      const distributionData = distribution.map((count, index) => ({
        range: `${index * 10}-${(index + 1) * 10}%`,
        count: count,
      }));

      setStats({
        totalEmployees,
        totalTests: totalSmsTests + totalCallTests + totalEmailTests,
        smsFailRate: parseFloat(smsFailRate as string),
        callFailRate: parseFloat(callFailRate as string),
        emailFailRate: parseFloat(emailFailRate as string),
        pieData,
        distributionData,
      });
    }
  }, [accountData]);

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
  }) => (
    <Card className="w-full">
      <CardContent className="flex items-center p-6">
        <div className={`rounded-full p-3 mr-4 bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );

  // Prevent hydration issues
  if (!mounted) return null;

  return (
    <div className={styles.dashboardContainer}>
      <div>
        <div className={styles.dashboardTitleContainer}>
          <h1 className={styles.dashboardTitle}>
            Cybersecurity Testing Dashboard
          </h1>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Total Tests"
              value={stats.totalTests}
              icon={AlertTriangle}
              color="purple"
            />
            <StatCard
              title="SMS Fail Rate"
              value={`${stats.smsFailRate}%`}
              icon={MessageSquare}
              color="red"
            />
            <StatCard
              title="Call Fail Rate"
              value={`${stats.callFailRate}%`}
              icon={PhoneCall}
              color="orange"
            />
            <StatCard
              title="Email Fail Rate"
              value={`${stats.emailFailRate}%`}
              icon={Mail}
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="mt-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  Test Results Distribution
                </h2>
              </CardHeader>
              <CardContent className="h-80">
                <PieChartComponent data={stats.pieData} colors={COLORS} />
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  Employee Fail Rate Distribution
                </h2>
              </CardHeader>
              <CardContent className="h-80">
                <BarChartComponent data={stats.distributionData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
