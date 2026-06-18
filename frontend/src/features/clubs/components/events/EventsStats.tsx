import React from 'react';
import { CheckCircle2, LayoutDashboard, RotateCcw, AlertCircle } from 'lucide-react';

import type { EventSummary } from '@/types/event';

interface EventsStatsProps {
  eventList: EventSummary[];
}

export const EventsStats: React.FC<EventsStatsProps> = ({ eventList }) => {
  const getCount = (status: string) => eventList.filter((e: EventSummary) => e.status === status).length;

  const stats = [
    { label: 'Live/Appr.', count: getCount('APPROVED'), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Submitted', count: getCount('SUBMITTED'), icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Reverted', count: getCount('REVERTED'), icon: RotateCcw, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Rejected', count: getCount('REJECTED'), icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => (
        <div key={idx} className={`p-6 rounded-[2rem] border ${s.border} ${s.bg} flex items-center gap-5 transition-all hover:shadow-lg hover:shadow-slate-100 group cursor-default`}>
          <div className={`w-12 h-12 rounded-2xl bg-white border ${s.border} flex items-center justify-center ${s.color} shadow-sm group-hover:scale-110 transition-transform`}>
            <s.icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-black text-slate-900 leading-none mb-1">{s.count}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
