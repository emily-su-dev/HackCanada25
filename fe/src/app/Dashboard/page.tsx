'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import {
  AlertTriangle,
  CheckCircle,
  PhoneCall,
  MessageSquare,
  Users,
  Percent,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import PieChartComponent from '../components/PieChartComponent';
import BarChartComponent from '../components/BarChartComponent';

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTests: 0,
    smsFailRate: 0,
    callFailRate: 0,
    pieData: [],
    distributionData: [],
  });

  const COLORS = [
    '#003f5c',
    '#2f4b7c',
    '#465881',
    '#5a678e',
    '#6e769b',
    '#8285a8',
    '#9695b5',
    '#aaa4c2',
  ];

  const { data: session } = useSession();

  // Handle initial mounting and fetch account ID
  useEffect(() => {
    setMounted(true);

    if (session?.user?.email) {
      const fetchAccountId = async () => {
        try {
          const getResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/email/${session.user.email}`,
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
        (sum, emp) => sum + (emp.numSmsLogs || 0),
        0
      );
      const totalCallTests = accountData.reduce(
        (sum, emp) => sum + (emp.numCallLogs || 0),
        0
      );
      const totalSmsFails = accountData.reduce(
        (sum, emp) => sum + (emp.numSmsFails || 0),
        0
      );
      const totalCallFails = accountData.reduce(
        (sum, emp) => sum + (emp.numCallFails || 0),
        0
      );

      // Calculate fail rates
      const smsFailRate = totalSmsTests
        ? ((totalSmsFails / totalSmsTests) * 100).toFixed(1)
        : 0;
      const callFailRate = totalCallTests
        ? ((totalCallFails / totalCallTests) * 100).toFixed(1)
        : 0;

      // Prepare data for pie chart
      const pieData = [
        { name: 'SMS Passes', value: totalSmsTests - totalSmsFails },
        { name: 'SMS Fails', value: totalSmsFails },
        { name: 'Call Passes', value: totalCallTests - totalCallFails },
        { name: 'Call Fails', value: totalCallFails },
      ];

      // Calculate individual employee fail rates and create distribution
      const employeeFailRates = accountData.map((emp) => {
        const totalTests = (emp.numSmsLogs || 0) + (emp.numCallLogs || 0);
        const totalFails = (emp.numSmsFails || 0) + (emp.numCallFails || 0);
        return totalTests > 0 ? (totalFails / totalTests) * 100 : 0;
      });

      // Create distribution buckets (0-10%, 10-20%, etc.)
      const distribution = new Array(10).fill(0);
      employeeFailRates.forEach((rate) => {
        const bucketIndex = Math.min(Math.floor(rate / 10), 9);
        distribution[bucketIndex]++;
      });

      const distributionData = distribution.map((count, index) => ({
        range: `${index * 10}-${(index + 1) * 10}%`,
        count: count,
      }));

      setStats({
        totalEmployees,
        totalTests: totalSmsTests + totalCallTests,
        smsFailRate,
        callFailRate,
        pieData,
        distributionData,
      });
    }
  }, [accountData]);

  // Prevent hydration issues
  if (!mounted) return null;

  const StatCard = ({ title, value, icon: Icon, color }) => (
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Security Awareness Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Test Results Distribution</h2>
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
  );
};

export default Dashboard;
