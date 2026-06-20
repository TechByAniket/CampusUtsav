import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { EmptyState } from './EmptyState';

interface ClubChartItem {
  name: string;
  value: number;
}

interface ClubPerformanceChartProps {
  clubChartData: ClubChartItem[];
  chartColors: string[];
}

export const ClubPerformanceChart: React.FC<ClubPerformanceChartProps> = ({
  clubChartData,
  chartColors,
}) => {
  const renderCustomizedBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white rounded-xl py-2.5 px-3 text-[10px] font-bold shadow-xl border border-slate-800 backdrop-blur-sm">
          <p className="uppercase tracking-wider text-indigo-400 mb-0.5">{data.name}</p>
          <p className="text-white text-xs font-black">{data.value} Events Hosted</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Events by Club</h3>
        </div>
        <div className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">Top Active Chapters</div>
      </div>
      <p className="text-slate-400 text-xs font-medium pl-3.5">Compare total events hosted by each institutional club.</p>
      <div className="w-full h-[320px] mt-6">
        {clubChartData.length === 0 ? (
          <EmptyState message="No club performance logs found" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clubChartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="clubGrad0" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="clubGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="clubGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="clubGrad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="clubGrad4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="clubGrad5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} dx={-5} />
              <Tooltip content={renderCustomizedBarTooltip} cursor={{ fill: 'rgba(226,232,240,0.3)', radius: 6 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={38}>
                {clubChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#clubGrad${index % 6})`} className="hover:opacity-85 transition-opacity cursor-pointer outline-none" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
