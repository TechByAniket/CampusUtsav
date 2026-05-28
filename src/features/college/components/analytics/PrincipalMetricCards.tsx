import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Trophy, 
  ArrowRight, 
  Users, 
  UserCheck, 
  CheckCircle2 
} from 'lucide-react';

interface ClubOption {
  id: number;
  name: string;
  shortForm: string;
}

interface PrincipalMetricCardsProps {
  kpiData: any;
  clubsList: ClubOption[];
  onNavigateToInbox: () => void;
}

export const PrincipalMetricCards: React.FC<PrincipalMetricCardsProps> = ({
  kpiData,
  clubsList,
  onNavigateToInbox,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Left Column: Campus Activity Pulse & Active Chapters */}
      <div className="space-y-6 flex flex-col justify-between">
        
        {/* Card A: The Campus Activity Pulse */}
        <div className="bg-[#0f172a] text-white rounded-[2rem] p-6 border border-[#1e293b] shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-[#334155] transition-all duration-300 min-h-[270px] flex-1">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/50 flex items-center justify-center shrink-0">
                  <ClipboardList size={13} />
                </div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider leading-none">Activity Monitor</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </div>
            </div>
            
            {/* Two-Column Internal Layout for Total Events and Status Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-6 items-center relative z-10">
              {/* Left: Total Events Metric */}
              <div className="sm:col-span-5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-slate-800/60 pb-4 sm:pb-0 sm:pr-4">
                <span className="text-7xl font-black text-white tracking-tighter leading-none block">
                  {kpiData?.totalEvents ?? 0}
                </span>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mt-3 leading-snug">
                  Total Approved Events
                </span>
              </div>
              
              {/* Right: Vertical Progress Stack */}
              <div className="sm:col-span-7 space-y-4">
                {/* Completed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                      Completed
                    </span>
                    <span className="text-white text-xs font-black">{kpiData?.completedEvents ?? 0}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, ((kpiData?.completedEvents ?? 0) / Math.max(1, kpiData?.totalEvents ?? 0)) * 100)}%` }}
                      className="h-full bg-slate-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Live Feed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      Live
                    </span>
                    <span className="text-emerald-400 text-xs font-black">{kpiData?.ongoingEvents ?? 0}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, ((kpiData?.ongoingEvents ?? 0) / Math.max(1, kpiData?.totalEvents ?? 0)) * 100)}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Upcoming */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      Upcoming
                    </span>
                    <span className="text-rose-400 text-xs font-black">{kpiData?.upcomingEvents ?? 0}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, ((kpiData?.upcomingEvents ?? 0) / Math.max(1, kpiData?.totalEvents ?? 0)) * 100)}%` }}
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card F: Active Chapters */}
        <div className="bg-white border border-slate-150 rounded-[1.5rem] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-300 transition-all duration-300 h-[125px] flex items-center justify-between group">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col justify-between h-full py-0.5">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider leading-none">Active Chapters</span>
              <div className="mt-2">
                <span className="text-4xl font-black text-slate-800 block">
                  {clubsList.length}
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 block">Active Clubs & Councils</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 self-center shrink-0">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50 flex items-center justify-center shrink-0 shadow-sm">
                <Trophy size={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Executive Alerts & Key Performance Indicators */}
      <div className="space-y-6 flex flex-col justify-between">
        
        {/* Row 1: Card H: Awaiting Approvals (Always at the very top of right side) */}
        <motion.div 
          onClick={onNavigateToInbox}
          animate={{ 
            borderColor: ['rgba(244, 63, 94, 0.25)', 'rgba(244, 63, 94, 0.65)', 'rgba(244, 63, 94, 0.25)'],
            boxShadow: [
              '0 0 0 rgba(244, 63, 94, 0)', 
              '0 0 12px rgba(244, 63, 94, 0.15)', 
              '0 0 0 rgba(244, 63, 94, 0)'
            ] 
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="bg-rose-50/20 border rounded-[1.5rem] p-5 hover:bg-rose-50/45 hover:border-rose-400 transition-colors duration-300 h-[125px] flex items-center justify-between group cursor-pointer"
        >
          <div className="flex flex-col justify-between h-full py-0.5 z-10">
            <span className="text-xs font-extrabold text-rose-500 uppercase tracking-wider leading-none flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Awaiting Approvals
            </span>
            <div>
              <h4 className="text-4xl font-black text-slate-800 leading-none tracking-tight">
                {kpiData?.eventsUnderApproval ?? 0}
              </h4>
              <p className="text-slate-500 text-xs font-semibold mt-1">Pending Approvals</p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-xl bg-rose-600 group-hover:bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 z-10">
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-300 animate-in fade-in" />
          </div>
        </motion.div>

        {/* Rows 2 & 3: The 4 Grid Square Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Card B: Total Registrations */}
          <div className="bg-white border border-slate-150 rounded-[1.5rem] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-300 transition-all duration-300 h-[125px] flex flex-col justify-between group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider leading-none">Total Registrations</span>
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 flex items-center justify-center shrink-0 shadow-sm">
                <Users size={12} />
              </div>
            </div>
            <div>
              <span className="text-4xl font-black text-slate-800 leading-none tracking-tight block">
                {(kpiData?.totalRegistrations ?? 0).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">Registrations (Team & Individual)</span>
            </div>
          </div>

          {/* Card C: Total Participants */}
          <div className="bg-white border border-slate-150 rounded-[1.5rem] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-300 transition-all duration-300 h-[125px] flex flex-col justify-between group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider leading-none">Total Participants</span>
              <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-600 border border-violet-100/50 flex items-center justify-center shrink-0 shadow-sm">
                <UserCheck size={12} />
              </div>
            </div>
            <div>
              <span className="text-4xl font-black text-slate-800 leading-none tracking-tight block">
                {(kpiData?.totalParticipants ?? 0).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">Active Engaged</span>
            </div>
          </div>

          {/* Card D: Total Attendance */}
          <div className="bg-white border border-slate-150 rounded-[1.5rem] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-300 transition-all duration-300 h-[125px] flex flex-col justify-between group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider leading-none">Total Attendance</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={12} />
              </div>
            </div>
            <div>
              <span className="text-4xl font-black text-slate-800 leading-none tracking-tight block">
                {(kpiData?.totalAttendance ?? 0).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">Verified Present</span>
            </div>
          </div>

          {/* Card E: Attendance Rate */}
          <div className="bg-white border border-slate-150 rounded-[1.5rem] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-300 transition-all duration-300 h-[125px] flex items-center justify-between group">
            <div className="flex flex-col justify-between h-full py-0.5">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider leading-none">Attendance Rate</span>
              <div>
                <span className="text-4xl font-black text-slate-800 leading-none tracking-tight block">
                  {kpiData?.attendanceRate ?? 0}%
                </span>
                <span className="text-xs font-semibold text-slate-500 mt-1 block">Average Show-Up</span>
              </div>
            </div>
            
            {/* Circular Radial SVG Visual */}
            <div className="relative w-14 h-14 shrink-0 shadow-inner rounded-full p-1 bg-slate-50 border border-slate-150/70">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle 
                  className="text-slate-150" 
                  strokeWidth="4" 
                  stroke="currentColor" 
                  fill="none" 
                  cx="18" 
                  cy="18" 
                  r="15" 
                />
                <circle 
                  className="text-indigo-600 transition-all duration-500" 
                  strokeWidth="4" 
                  strokeDasharray="94.2" 
                  strokeDashoffset={94.2 - (94.2 * (kpiData?.attendanceRate ?? 0)) / 100}
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="none" 
                  cx="18" 
                  cy="18" 
                  r="15" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800">
                {kpiData?.attendanceRate ?? 0}%
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
