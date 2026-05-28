import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface TopEvent {
  eventId: number;
  eventName: string;
  clubShortForm: string;
  totalParticipants: number;
  totalAttendance: number;
  attendanceRate: number;
}

interface EventLeaderboardTableProps {
  leaderboardLimit: number;
  setLeaderboardLimit: (limit: number) => void;
  topEventsData: TopEvent[];
}

export const EventLeaderboardTable: React.FC<EventLeaderboardTableProps> = ({
  leaderboardLimit,
  setLeaderboardLimit,
  topEventsData,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Institutional Event Leaderboard</h3>
          </div>
          <p className="text-slate-400 text-xs font-medium mt-1">Top completed events ranked by registered student show-up index.</p>
        </div>
        <div className="relative">
          <select
            value={leaderboardLimit}
            onChange={(e) => setLeaderboardLimit(Number(e.target.value))}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-full pl-4 pr-9 py-2 text-xs font-black uppercase tracking-wider outline-none hover:bg-slate-100 hover:border-slate-300 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer select-none shadow-sm"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
        </div>
      </div>

      {topEventsData.length === 0 ? (
        <EmptyState message="No completed events found matching selection parameters" />
      ) : (
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 items-center px-5 py-3 bg-slate-50/80 border border-slate-100 rounded-xl mb-2">
            <div className="col-span-1 text-[11px] font-black uppercase tracking-widest text-slate-400">#</div>
            <div className="col-span-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Event</div>
            <div className="col-span-2 text-[11px] font-black uppercase tracking-widest text-slate-400">Club</div>
            <div className="col-span-1 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Registered</div>
            <div className="col-span-1 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Present</div>
            <div className="col-span-3 text-[11px] font-black uppercase tracking-widest text-slate-400">Show-up Rate</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {topEventsData.map((event, idx) => {
              let rankBadgeStyle = "bg-slate-50 text-slate-500 border-slate-200";
              let rankBadgeContent: string | React.ReactNode = `${idx + 1}`;
              let rowHover = "hover:bg-slate-50/80 hover:border-slate-200 hover:shadow-md";
              if (idx === 0) {
                rankBadgeStyle = "bg-amber-50 text-amber-800 border-amber-200/50 shadow-sm shadow-amber-100";
                rankBadgeContent = "🥇";
                rowHover = "hover:bg-amber-500/[0.03] hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/30";
              } else if (idx === 1) {
                rankBadgeStyle = "bg-slate-100 text-slate-700 border-slate-200/50 shadow-sm shadow-slate-100";
                rankBadgeContent = "🥈";
                rowHover = "hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/30";
              } else if (idx === 2) {
                rankBadgeStyle = "bg-orange-50/70 text-orange-800 border-orange-200/50 shadow-sm shadow-orange-100";
                rankBadgeContent = "🥉";
                rowHover = "hover:bg-orange-500/[0.03] hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/30";
              }

              return (
                <motion.div
                  key={event.eventId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2, scale: 1.005 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22, delay: idx * 0.03 }}
                  className={`grid grid-cols-12 gap-4 items-center px-5 py-4 rounded-xl border border-slate-100/70 bg-white transition-all group cursor-pointer ${rowHover}`}
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm ${rankBadgeStyle}`}>
                      {rankBadgeContent}
                    </div>
                  </div>

                  {/* Event Name */}
                  <div className="col-span-4">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide group-hover:text-orange-600 transition-colors leading-snug truncate">
                      {event.eventName}
                    </h4>
                  </div>

                  {/* Club */}
                  <div className="col-span-2">
                    <span className="inline-block bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                      {event.clubShortForm}
                    </span>
                  </div>

                  {/* Registered */}
                  <div className="col-span-1 text-center">
                    <span className="text-sm font-black text-slate-800">{event.totalParticipants ?? 0}</span>
                  </div>

                  {/* Present */}
                  <div className="col-span-1 text-center">
                    <span className="text-sm font-black text-slate-800">{event.totalAttendance ?? 0}</span>
                  </div>

                  {/* Show-up Rate */}
                  <div className="col-span-3 flex items-center gap-3">
                    <span className="text-sm font-black text-slate-800 shrink-0 w-14 text-right">
                      {event.attendanceRate ?? 0}%
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, Math.max(0, event.attendanceRate ?? 0))}%` }} 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
