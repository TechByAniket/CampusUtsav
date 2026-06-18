import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, 
  Users2, 
  UserCheck, 
  Activity, 
  UserMinus 
} from 'lucide-react';

interface EventAnalytics {
  totalRegistrations: number;
  individualRegistrations: number;
  teamRegistrations: number;
  totalParticipants: number;
  totalAttendance: number;
  attendanceRate: number;
  dropOffRate: number;
}

interface EventPerformanceAnalyticsProps {
  analytics: EventAnalytics | null;
  showAnalytics: boolean;
}

export const EventPerformanceAnalytics: React.FC<EventPerformanceAnalyticsProps> = ({
  analytics,
  showAnalytics,
}) => {
  if (!showAnalytics || !analytics) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-100 hover:shadow-md hover:border-slate-300 transition-all duration-300"
    >
      {/* Metric 1: Registrations */}
      <div className="flex-1 p-6 flex flex-col justify-between hover:bg-slate-50/50 transition-all group duration-300">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Registrations</span>
          <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105">
            <ClipboardCheck size={12} />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black text-slate-800 leading-none tracking-tight block">
            {analytics.totalRegistrations}
          </span>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mt-2.5 leading-none">
            {analytics.individualRegistrations} Indiv • {analytics.teamRegistrations} Teams
          </span>
        </div>
      </div>

      {/* Metric 2: Participants */}
      <div className="flex-1 p-6 flex flex-col justify-between hover:bg-slate-50/50 transition-all group duration-300">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Participants</span>
          <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-600 border border-violet-100/50 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105">
            <Users2 size={12} />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black text-slate-800 leading-none tracking-tight block">
            {analytics.totalParticipants}
          </span>
          <span className="text-[9px] font-semibold text-slate-550 block mt-2.5 leading-none">
            Cumulative seats filled
          </span>
        </div>
      </div>

      {/* Metric 3: Attendance */}
      <div className="flex-1 p-6 flex flex-col justify-between hover:bg-slate-50/50 transition-all group duration-300">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Attendance</span>
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105">
            <UserCheck size={12} />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black text-slate-800 leading-none tracking-tight block">
            {analytics.totalAttendance}
          </span>
          <span className="text-[9px] font-semibold text-slate-550 block mt-2.5 leading-none">
            Verified check-ins
          </span>
        </div>
      </div>

      {/* Metric 4: Turnout Rate */}
      <div className="flex-1 p-6 flex flex-col justify-between hover:bg-slate-50/50 transition-all group duration-300">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Turnout Rate</span>
          <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105">
            <Activity size={12} />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black text-slate-800 leading-none tracking-tight block">
            {analytics.attendanceRate}%
          </span>
          <span className="text-[9px] font-semibold text-slate-550 block mt-2.5 leading-none">
            Attendance of bookings
          </span>
        </div>
      </div>

      {/* Metric 5: Drop-Off Rate */}
      <div className="flex-1 p-6 flex flex-col justify-between hover:bg-slate-50/50 transition-all group duration-300">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Drop-Off Rate</span>
          <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/50 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105">
            <UserMinus size={12} />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-3xl font-black text-slate-800 leading-none tracking-tight block">
            {analytics.dropOffRate}%
          </span>
          <span className="text-[9px] font-semibold text-slate-550 block mt-2.5 leading-none">
            Absences and no-shows
          </span>
        </div>
      </div>
    </motion.div>
  );
};
