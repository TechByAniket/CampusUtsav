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

// Subcomponents Import
import {
  PrincipalOverviewHeader,
  PrincipalMetricCards,
  EventTrendsChart,
  EventLeaderboardTable
} from '@/features/college/components/analytics';

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
      // 1. Fetch remaining allowed analytics sequential APIs
      const analyticsRes = await getAnalytics();
      const trendsRes = await getEventTrends(selectedYear, undefined); // Scoped automatically by backend token
      const topEventsRes = await getTopPerformingEvents(leaderboardLimit);

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

  /* ==========================================
     EXECUTIVE COMPACT SKELETON LOADER
     ========================================== */
  const DashboardSkeleton = () => (
    <div className="space-y-12 animate-pulse">
      {/* 2-COLUMN PREMIUM DASHBOARD GRID LAYOUT SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column Skeleton */}
        <div className="space-y-6">
          {/* Spotlight Card Skeleton */}
          <div className="bg-slate-900 rounded-[2rem] p-6 min-h-[270px] flex flex-col justify-between">
            <div>
              <div className="h-4 w-32 bg-slate-800 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-6 items-center">
                <div className="sm:col-span-5">
                  <div className="h-16 w-20 bg-slate-800 rounded-lg" />
                  <div className="h-3 w-36 bg-slate-800 rounded mt-3" />
                </div>
                <div className="sm:col-span-7 space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between">
                        <div className="h-3 w-16 bg-slate-800 rounded" />
                        <div className="h-3 w-6 bg-slate-800 rounded" />
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Chapters Card Skeleton */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 h-[125px] flex items-center justify-between shadow-sm">
            <div className="flex flex-col justify-between h-full py-0.5 w-2/3">
              <div className="h-3 w-16 bg-slate-150 rounded" />
              <div>
                <div className="h-6 w-12 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-36 bg-slate-100 rounded mt-2" />
              </div>
            </div>
            <div className="w-7 h-7 bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          {/* Card H: Awaiting Approvals Skeleton */}
          <div className="bg-rose-50/10 rounded-[1.5rem] border border-rose-200/50 p-5 h-[125px] flex items-center justify-between shadow-sm">
            <div className="flex flex-col justify-between h-full py-0.5 w-2/3">
              <div className="h-3 w-24 bg-rose-200/50 rounded animate-pulse" />
              <div>
                <div className="h-7 w-12 bg-rose-300/40 rounded-md animate-pulse" />
                <div className="h-3.5 w-48 bg-rose-100/30 rounded mt-2" />
              </div>
            </div>
            <div className="w-9 h-9 bg-rose-300/40 rounded-xl" />
          </div>

          {/* 4 Square Bento Blocks Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 h-[125px] flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 bg-slate-150 rounded" />
                  <div className="h-6 w-6 bg-slate-50 rounded-lg" />
                </div>
                <div>
                  <div className="h-7 w-20 bg-slate-150 rounded" />
                  <div className="h-2.5 w-12 bg-slate-50 rounded mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 bg-white rounded-[2rem] border border-slate-100 p-8 h-[400px] flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-150 rounded-md" />
            <div className="h-4 w-72 bg-slate-50/50 rounded-sm" />
          </div>
          <div className="h-60 w-full bg-slate-50 rounded-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto space-y-12 relative z-10">
        
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

        {/* 3. Loader or Dashboard Grid */}
        {isLoading ? (
          <DashboardSkeleton />
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

      </main>
    </div>
  );
};
