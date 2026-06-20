import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Service Imports
import { 
  getAnalytics, 
  getTopPerformingEvents, 
  getEventTrends 
} from '@/services/analyticsService';
import { getAllClubsForPrincipal } from '@/services/clubService';

import {
  PrincipalOverviewHeader,
  PrincipalMetricCards,
  EventTrendsChart,
  EventLeaderboardTable
} from '@/features/college/components/analytics';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

/* ==========================================
   TYPES DEFINITION
   ========================================== */
interface ClubOption {
  id: number;
  name: string;
  shortForm: string;
}

interface TopEvent {
  eventId: number;
  eventName: string;
  clubShortForm: string;
  totalParticipants: number;
  totalAttendance: number;
  attendanceRate: number;
}

interface TrendData {
  month: string;
  count: number;
}

export const ClubOverview: React.FC = () => {
  const navigate = useNavigate();

  // Filters State
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [clubsList, setClubsList] = useState<ClubOption[]>([]);
  const [leaderboardLimit, setLeaderboardLimit] = useState<number>(5);

  // Analytics Data States
  const [kpiData, setKpiData] = useState<any>(null);
  const [trendChartData, setTrendChartData] = useState<TrendData[]>([]);
  const [topEventsData, setTopEventsData] = useState<TopEvent[]>([]);

  // Page States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Year options helper: show last 3 years from current year
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  /* ==========================================
     API DATA LOADING
     ========================================== */
  const loadClubs = async () => {
    try {
      const clubs = await getAllClubsForPrincipal();
      setClubsList(clubs || []);
    } catch (err: any) {
      console.error("Failed to load clubs list for card metric:", err.message);
    }
  };

  const loadDashboardData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setIsError(false);

    try {
      // ==============
      // Parallel and fast, await is slow and sequential
      // ==============
      const [analyticsRes, trendsRes, topEventsRes] = await Promise.all([
        getAnalytics(),
        getEventTrends(selectedYear, undefined), // Scoped automatically by backend token
        getTopPerformingEvents(leaderboardLimit)
      ]);

      // 2. State Mappings
      setKpiData(analyticsRes || {});
      setTrendChartData(trendsRes || []);
      setTopEventsData(topEventsRes || []);

    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || 'Something went wrong while fetching club analytics.');
      toast.error(err.message || 'Error loading dashboard statistics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadTrendsData = async () => {
    try {
      const trendsRes = await getEventTrends(selectedYear, undefined);
      setTrendChartData(trendsRes || []);
    } catch (err: any) {
      console.error('Failed to reload trends:', err.message);
    }
  };

  // Initial load
  useEffect(() => {
    loadClubs();
  }, []);

  // Reload all stats on leaderboard limits changes
  useEffect(() => {
    loadDashboardData();
  }, [leaderboardLimit]);

  // Reload only trends on year change
  useEffect(() => {
    if (!isLoading) loadTrendsData();
  }, [selectedYear]);



  return (
    <div className="w-full space-y-10 pb-10">
        
        {/* 1. Header Hero section */}
        <PrincipalOverviewHeader 
          isRefreshing={isRefreshing}
          isLoading={isLoading}
          onRefresh={() => loadDashboardData(true)}
        />

        {/* 2. Error Sync */}
        {isError && (
          <div className="bg-red-50 border border-red-100 rounded-[1.5rem] p-6 flex items-center gap-4 shadow-sm animate-in fade-in">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-800">Sync Failure</h4>
              <p className="text-red-600/80 text-[11px] mt-0.5">{errorMessage || 'Unable to sync analytics with server.'}</p>
            </div>
            <button
              onClick={() => loadDashboardData()}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <PageSkeleton layout="dashboard" />
        ) : (
          <div className="space-y-12">
            {/* Bento metric grid */}
            <PrincipalMetricCards 
              kpiData={kpiData}
              clubsList={clubsList}
              onNavigateToInbox={() => navigate('/club-dashboard/events')}
            />

            {/* Charts Layer (Trends only) */}
            <div className="grid grid-cols-12 gap-8">
              <EventTrendsChart 
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                yearOptions={yearOptions}
                trendChartData={trendChartData}
                fullWidth={true} // Extends to 12-columns since category distribution is bypassed
              />
            </div>

            {/* Leaderboard Table */}
            <EventLeaderboardTable 
              leaderboardLimit={leaderboardLimit}
              setLeaderboardLimit={setLeaderboardLimit}
              topEventsData={topEventsData}
            />
          </div>
        )}

    </div>
  );
};
