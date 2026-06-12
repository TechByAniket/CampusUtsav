import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { DashboardHero } from '../../components/DashboardHero';

// Analytics Components
import { KPICards } from '../../components/analytics/KPICards';
import { AnalyticsHub } from '../../components/analytics/AnalyticsHub';
import { BranchPerformance } from '../../components/analytics/BranchPerformance';

// Overview/Operations Components
import { QuickActions } from '../../components/overview/QuickActions';
import { OperationsPlanner } from '../../components/overview/OperationsPlanner';

// Principal Specific Analytics Component
import { PrincipalOverview } from './PrincipalOverview';

export const Overview: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <div className="w-full space-y-10 pb-10">
        
        {/* Hero Section */}
        {role !== 'ROLE_PRINCIPAL' && <DashboardHero />}

        {role === 'ROLE_PRINCIPAL' ? (
          <PrincipalOverview />
        ) : (
          <>
            {/* KPI Performance Section */}
            <KPICards />

            {/* Main Analytics Hub */}
            <AnalyticsHub />

            {/* Departmental Performance & Actions */}
            <div className="grid grid-cols-12 gap-8">
                <BranchPerformance />
                <QuickActions />
            </div>

            {/* Campus Operations & Scheduling */}
            <OperationsPlanner />
          </>
        )}
    </div>
  );
};
