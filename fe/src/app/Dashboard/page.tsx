'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle,
  PhoneCall,
  MessageSquare,
  Users,
  Percent,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

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
  });

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

      setStats({
        totalEmployees,
        totalTests: totalSmsTests + totalCallTests,
        smsFailRate,
        callFailRate,
        pieData,
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

      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Test Results Distribution</h2>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
