// src/components/dashboard/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsageStats, 
  fetchCreditConsumption,
  fetchQueryDistribution,
  fetchTopDocuments,
  fetchActivityLog
} from '../../redux/slices/dashboardSlice';
import { useTenant } from '../../contexts/TenantContext';
import { PageHeader } from '../common/PageHeader';
import { StatsCard } from '../common/StatsCard';
import { CreditConsumption } from './CreditConsumption';
import { QueryDistribution } from './QueryDistribution';
import { TopDocuments } from './TopDocuments';
import { ActivityLog } from './ActivityLog';
import { 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  const [period, setPeriod] = useState('month');
  
  const { 
    usageStats, 
    creditConsumption, 
    queryDistribution,
    topDocuments,
    activityLog,
    isLoading 
  } = useSelector(state => state.dashboard);
  
  useEffect(() => {
    if (tenant) {
      dispatch(fetchUsageStats({ tenantId: tenant.id, period }));
      dispatch(fetchCreditConsumption({ tenantId: tenant.id, period }));
      dispatch(fetchQueryDistribution({ tenantId: tenant.id, period }));
      dispatch(fetchTopDocuments({ tenantId: tenant.id, limit: 5 }));
      dispatch(fetchActivityLog({ tenantId: tenant.id, page: 1, limit: 10 }));
    }
  }, [dispatch, tenant, period]);
  
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back! Here's an overview of your Airiam usage.`}
      />
      
      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          name="Total Queries"
          value={usageStats?.totalQueries || 0}
          icon={ChatBubbleLeftRightIcon}
          change={usageStats?.queryChange}
          color="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          name="Documents Analyzed"
          value={usageStats?.documentsAnalyzed || 0}
          icon={DocumentTextIcon}
          change={usageStats?.documentChange}
          color="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          name="Credits Used"
          value={creditConsumption?.usedCredits || 0}
          icon={CreditCardIcon}
          change={creditConsumption?.creditChange}
          color="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatsCard
          name="Active Users"
          value={usageStats?.activeUsers || 0}
          icon={ChartBarIcon}
          change={usageStats?.userChange}
          color="bg-orange-100 dark:bg-orange-900/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>
      
      {/* Credit Consumption Chart */}
      <div className="mt-6">
        <CreditConsumption
          data={creditConsumption}
          isLoading={isLoading}
          period={period}
          onPeriodChange={handlePeriodChange}
        />
      </div>
      
      {/* Charts & Lists */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <QueryDistribution
          data={queryDistribution}
          isLoading={isLoading}
          period={period}
          onPeriodChange={handlePeriodChange}
        />
        <TopDocuments
          data={topDocuments}
          isLoading={isLoading}
        />
      </div>
      
      {/* Activity Log */}
      <div className="mt-6">
        <ActivityLog
          data={activityLog}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;