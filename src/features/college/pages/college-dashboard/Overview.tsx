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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 pb-20">
      <main className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Hero Section */}
        {role !== 'ROLE_PRINCIPAL' && <DashboardHero />}

        <div className="px-4 sm:px-6 lg:px-8 space-y-16">
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
      </main>

      <footer className="mt-32 py-12 border-t border-slate-100 flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          CampusUtsav Intelligence <span className="text-indigo-400/50">v2.5</span>
        </p>
      </footer>
    </div>
  );
};
