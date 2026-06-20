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
      // ==============
      // Parallel and fast, await is slow and sequential
      // ==============
      const [
        analyticsRes,
        clubCountRes,
        categoryCountRes,
        trendsRes,
        topEventsRes
      ] = await Promise.all([
        getAnalytics(),
        getEventsCountByClub(),
        getEventsCountByCategory(),
        getEventTrends(selectedYear, clubFilterVal),
        getTopPerformingEvents(leaderboardLimit)
      ]);

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

  return (
    <div className="w-full space-y-10 pb-10">

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

      {isLoading ? (
        <PageSkeleton layout="dashboard" />
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
