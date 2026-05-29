import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { EmptyState } from './EmptyState';

interface TrendData {
  month: string;
  count: number;
}

interface ClubOption {
  id: number;
  name: string;
  shortForm: string;
}

interface EventTrendsChartProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  yearOptions: number[];
  trendChartData: TrendData[];
  fullWidth?: boolean;
  selectedClub?: string;
  onClubChange?: (club: string) => void;
  clubsList?: ClubOption[];
}

export const EventTrendsChart: React.FC<EventTrendsChartProps> = ({
  selectedYear,
  setSelectedYear,
  yearOptions,
  trendChartData,
  fullWidth = false,
  selectedClub = 'ALL',
  onClubChange,
  clubsList = [],
}) => {
  const { role } = useSelector((state: RootState) => state.auth);
  const showClubFilter = role === 'ROLE_COLLEGE' || role === 'ROLE_PRINCIPAL';

  const renderCustomizedTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white rounded-xl py-2.5 px-3.5 text-[10px] font-bold shadow-xl border border-slate-800 backdrop-blur-sm">
          <p className="uppercase tracking-wider text-teal-400 mb-1">{data.month}</p>
          <p className="text-white text-xs font-black">{data.count} Events Scheduled</p>
        </div>
      );
    }
    return null;
  };

  const isDataEmpty = trendChartData.length === 0 || trendChartData.every(x => x.count === 0);

  return (
    <div className={`col-span-12 ${fullWidth ? '' : 'lg:col-span-8'} bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 flex flex-col justify-between h-[450px]`}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Monthly Event Trends</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-teal-600 text-[9px] font-black uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-lg">
              <TrendingUp size={10} />
              Volume Distribution
            </div>
            {showClubFilter && onClubChange && (
              <div className="relative">
                <select
                  value={selectedClub}
                  onChange={(e) => onClubChange(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-full pl-4 pr-9 py-2 text-xs font-black uppercase tracking-wider outline-none hover:bg-slate-100 hover:border-slate-300 focus:border-orange-500 focus:bg-white transition-all cursor-pointer select-none shadow-sm max-w-[200px] truncate"
                >
                  <option value="ALL">All Clubs</option>
                  {clubsList.map((club) => (
                    <option key={club.id} value={club.id.toString()}>
                      {club.shortForm || club.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
              </div>
            )}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-full pl-4 pr-9 py-2 text-xs font-black uppercase tracking-wider outline-none hover:bg-slate-100 hover:border-slate-300 focus:border-orange-500 focus:bg-white transition-all cursor-pointer select-none shadow-sm"
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-medium pl-3.5">Analysis of scheduled activity levels mapped monthly across the college calendar.</p>
      </div>

      <div className="flex-1 w-full h-[280px] mt-6">
        {isDataEmpty ? (
          <EmptyState message="No trend data recorded for selected year" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendChartData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrends" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#f43f5e" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                dx={-5}
              />
              <Tooltip content={renderCustomizedTrendTooltip} cursor={{ stroke: '#f1f5f9', strokeWidth: 1.5 }} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="url(#trendStroke)" 
                strokeWidth={3.5} 
                fillOpacity={1} 
                fill="url(#colorTrends)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
