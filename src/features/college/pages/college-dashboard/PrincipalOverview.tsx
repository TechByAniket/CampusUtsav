import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Service Imports
import { 
  getEventsCountByClub, 
  getEventsCountByCategory, 
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
  CategoryDistributionChart,
  ClubPerformanceChart,
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

export const PrincipalOverview: React.FC = () => {
  const navigate = useNavigate();
  // Filters State
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedClub, setSelectedClub] = useState<string>('ALL'); // 'ALL' or club ID/shortForm
  const [clubsList, setClubsList] = useState<ClubOption[]>([]);
  const [leaderboardLimit, setLeaderboardLimit] = useState<number>(5);

  // Analytics Data States
  const [kpiData, setKpiData] = useState<any>(null);
  const [clubChartData, setClubChartData] = useState<{ name: string; value: number }[]>([]);
  const [categoryChartData, setCategoryChartData] = useState<{ name: string; value: number }[]>([]);
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

  // Colors Config for visual harmony
  const COLORS = {
    primary: '#ea580c',     // Deep Orange
    secondary: '#f43f5e',   // Soft Rose
    accent: '#818cf8',      // Soft Indigo
    violet: '#a78bfa',      // Soft Violet
    emerald: '#34d399',     // Emerald Green
    sky: '#38bdf8',         // Sky Blue
    neutralDark: '#1e293b', // Slate 800
    chartColors: ['#ea580c', '#f43f5e', '#818cf8', '#a78bfa', '#34d399', '#38bdf8', '#fb7185', '#94a3b8']
  };

  /* ==========================================
     API DATA LOADING
     ========================================== */
  const loadClubs = async () => {
    try {
      const clubs = await getAllClubsForPrincipal();
      setClubsList(clubs || []);
    } catch (err: any) {
      console.error("Failed to load clubs list:", err.message);
    }
  };

  const loadDashboardData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setIsError(false);

    // Prepare club filter argument (map 'ALL' to undefined for service)
    const clubFilterVal = selectedClub === 'ALL' ? undefined : selectedClub;

    try {
      const analyticsRes = await getAnalytics();
      const clubCountRes = await getEventsCountByClub();
      const categoryCountRes = await getEventsCountByCategory();
      const trendsRes = await getEventTrends(selectedYear, clubFilterVal);
      const topEventsRes = await getTopPerformingEvents(leaderboardLimit);

      // 1. KPI Data mapping
      setKpiData(analyticsRes || {});

      // 2. Club Count mapping
      if (clubCountRes && typeof clubCountRes === 'object') {
        const formattedClubs = Object.entries(clubCountRes).map(([name, val]) => ({
          name,
          value: Number(val)
        })).sort((a, b) => b.value - a.value);
        setClubChartData(formattedClubs);
      } else {
        setClubChartData([]);
      }

      // 3. Category Count mapping
      if (categoryCountRes && typeof categoryCountRes === 'object') {
        const formattedCats = Object.entries(categoryCountRes).map(([name, val]) => ({
          name,
          value: Number(val)
        })).sort((a, b) => b.value - a.value);
        setCategoryChartData(formattedCats);
      } else {
        setCategoryChartData([]);
      }

      // 4. Trend Data mapping
      setTrendChartData(trendsRes || []);

      // 5. Top Events mapping
      setTopEventsData(topEventsRes || []);

    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || 'Something went wrong while fetching analytics.');
      toast.error(err.message || 'Error loading dashboard statistics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Reload only trends when year changes
  const loadTrendsData = async () => {
    const clubFilterVal = selectedClub === 'ALL' ? undefined : selectedClub;
    try {
      const trendsRes = await getEventTrends(selectedYear, clubFilterVal);
      setTrendChartData(trendsRes || []);
    } catch (err: any) {
      console.error('Failed to reload trends:', err.message);
    }
  };

  // Initial load
  useEffect(() => {
    loadClubs();
  }, []);

  // Reload all stats on club/leaderboard filter change
  useEffect(() => {
    loadDashboardData();
  }, [selectedClub, leaderboardLimit]);

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
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 p-8 h-[400px] flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-150 rounded-md" />
            <div className="h-4 w-72 bg-slate-50/50 rounded-sm" />
          </div>
          <div className="h-60 w-full bg-slate-50 rounded-xl" />
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 p-8 h-[400px] flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-slate-150 rounded-md" />
            <div className="h-4 w-52 bg-slate-50/50 rounded-sm" />
          </div>
          <div className="h-60 w-full bg-slate-50 rounded-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      
      {/* 1. Header Hero section */}
      <PrincipalOverviewHeader 
        isRefreshing={isRefreshing}
        isLoading={isLoading}
        onRefresh={() => loadDashboardData(true)}
      />

      {/* 3. Error Sync */}
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

      {/* 4. Loader or Dashboard Grid */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-12">
          {/* Bento metric grid */}
          <PrincipalMetricCards 
            kpiData={kpiData}
            clubsList={clubsList}
            onNavigateToInbox={() => navigate('/college-dashboard/inbox')}
          />

          {/* Charts Layer (Trends + Category) */}
          <div className="grid grid-cols-12 gap-8">
            <EventTrendsChart 
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              yearOptions={yearOptions}
              trendChartData={trendChartData}
              selectedClub={selectedClub}
              onClubChange={setSelectedClub}
              clubsList={clubsList}
            />

            <CategoryDistributionChart 
              categoryChartData={categoryChartData}
              chartColors={COLORS.chartColors}
            />
          </div>

          {/* Events by Club Vertical Bar Chart */}
          <ClubPerformanceChart 
            clubChartData={clubChartData}
            chartColors={COLORS.chartColors}
          />

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
