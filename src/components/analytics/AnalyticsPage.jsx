// src/components/analytics/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTenant } from '../../contexts/TenantContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LoadingIndicator } from '../common/LoadingIndicator';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// This would come from an analytics slice in real implementation
// For now we'll use mock data
const fetchAnalyticsData = (tenantId, period, startDate, endDate) => {
  return {
    type: 'FETCH_ANALYTICS',
    payload: {
      tenantId,
      period,
      startDate,
      endDate
    }
  };
};

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for visualization
  const [analyticsData, setAnalyticsData] = useState({
    usageOverTime: [
      { date: '2025-01', queries: 120, fileAnalysis: 45 },
      { date: '2025-02', queries: 150, fileAnalysis: 60 },
      { date: '2025-03', queries: 180, fileAnalysis: 75 },
      { date: '2025-04', queries: 220, fileAnalysis: 90 }
    ],
    queryCategories: [
      { name: 'Documents', value: 45 },
      { name: 'Presentations', value: 25 },
      { name: 'Spreadsheets', value: 20 },
      { name: 'PDFs', value: 35 },
      { name: 'Text Files', value: 15 }
    ],
    userActivity: [
      { user: 'User 1', queries: 85, fileUploads: 12 },
      { user: 'User 2', queries: 45, fileUploads: 8 },
      { user: 'User 3', queries: 110, fileUploads: 20 },
      { user: 'User 4', queries: 65, fileUploads: 15 },
      { user: 'User 5', queries: 30, fileUploads: 5 }
    ],
    responseTime: [
      { date: '2025-01', time: 0.8 },
      { date: '2025-02', time: 0.9 },
      { date: '2025-03', time: 0.75 },
      { date: '2025-04', time: 0.65 }
    ]
  });
  
  useEffect(() => {
    if (tenant) {
      setIsLoading(true);
      
      // In a real implementation, this would fetch actual analytics data
      // For now, we'll just simulate a loading state
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [tenant, period, dateRange]);
  
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };
  
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };
  
  // Colors for the charts
  const COLORS = ['#4f46e5', '#7c3aed', '#06b6d4', '#0ea5e9', '#3b82f6'];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Analytics"
        description="Detailed insights and statistics about your Airiam usage."
        actions={
          <div className="flex space-x-4">
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
            
            <Button>
              Export Data
            </Button>
          </div>
        }
      />
      
      {isLoading ? (
        <div className="mt-6 flex justify-center">
          <LoadingIndicator size="lg" />
        </div>
      ) : (
        <>
          {/* Usage Over Time Chart */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Usage Over Time
            </h2>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.usageOverTime}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.375rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '0.75rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="queries" name="Chat Queries" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fileAnalysis" name="File Analyses" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Query Categories Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Query Categories
              </h2>
              
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.queryCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.queryCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} queries`, null]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '0.375rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '0.75rem',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            {/* Response Time Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Average Response Time (seconds)
              </h2>
              
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsData.responseTime}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(2)} seconds`, 'Response Time']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '0.375rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '0.75rem',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="time" name="Response Time" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          {/* User Activity Table */}
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              User Activity
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Queries
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      File Uploads
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {analyticsData.userActivity.map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.queries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.fileUploads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.queries + user.fileUploads}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;