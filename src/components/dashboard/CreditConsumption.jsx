// src/components/dashboard/CreditConsumption.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Card } from '../common/Card';
import { PeriodSelector } from '../common/PeriodSelector';
import { LoadingIndicator } from '../common/LoadingIndicator';

export const CreditConsumption = ({ data, isLoading, period, onPeriodChange }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Credit Consumption
          </h2>
          <PeriodSelector value={period} onChange={onPeriodChange} />
        </div>
        <div className="flex justify-center p-8">
          <LoadingIndicator />
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Credit Consumption
        </h2>
        <PeriodSelector value={period} onChange={onPeriodChange} />
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 dark:bg-purple-900/20">
          <CreditCardIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Credits Used / Total
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {data?.usedCredits || 0} / {data?.totalCredits || 0}
          </p>
        </div>
      </div>
      
      {data?.dailyConsumption && data.dailyConsumption.length > 0 && (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.dailyConsumption}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.375rem',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '0.75rem',
                }}
              />
              <Bar 
                dataKey="chatCredits" 
                name="Chat Credits"
                stackId="a"
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="fileCredits" 
                name="File Analysis Credits"
                stackId="a"
                fill="#c084fc" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};