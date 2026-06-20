import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
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

const getRateColor = (rate: number) => {
  if (rate >= 80) return { bar: 'from-emerald-400 to-teal-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (rate >= 60) return { bar: 'from-amber-400 to-orange-400', text: 'text-amber-600', bg: 'bg-amber-50' };
  if (rate >= 40) return { bar: 'from-orange-400 to-rose-400', text: 'text-orange-600', bg: 'bg-orange-50' };
  return { bar: 'from-rose-400 to-red-500', text: 'text-rose-600', bg: 'bg-rose-50' };
};

export const EventLeaderboardTable: React.FC<EventLeaderboardTableProps> = ({
  leaderboardLimit,
  setLeaderboardLimit,
  topEventsData,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h3 className="text-base font-black uppercase tracking-wider text-slate-900">
              Institutional Event Leaderboard
            </h3>
          </div>
          <p className="text-slate-400 text-xs font-medium pl-3.5">
            Top completed events ranked by registered student show-up index.
          </p>
        </div>
        <div className="relative">
          <select
            value={leaderboardLimit}
            onChange={(e) => setLeaderboardLimit(Number(e.target.value))}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-full pl-4 pr-9 py-2 text-xs font-black uppercase tracking-wider outline-none hover:bg-slate-100 hover:border-slate-300 focus:border-amber-500 focus:bg-white transition-all cursor-pointer select-none shadow-sm"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
        </div>
      </div>

      {/* Body */}
      {topEventsData.length === 0 ? (
        <EmptyState message="No completed events found matching selection parameters" />
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-900 border-b border-slate-800 text-left">
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-100 w-[70px]">Rank</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-100">Event</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-100">Club</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-100 text-center">Registered</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-100 text-center">Present</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-100">Show-up Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topEventsData.map((event, idx) => {
                  const rate = Math.min(100, Math.max(0, event.attendanceRate ?? 0));
                  const rateColor = getRateColor(rate);

                  let rankContent: React.ReactNode;
                  if (idx === 0) {
                    rankContent = (
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shadow-sm shadow-amber-100/50">
                        <Medal size={16} className="text-amber-500" />
                      </div>
                    );
                  } else if (idx === 1) {
                    rankContent = (
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shadow-sm shadow-slate-100/50">
                        <Medal size={16} className="text-slate-400" />
                      </div>
                    );
                  } else if (idx === 2) {
                    rankContent = (
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shadow-sm shadow-orange-100/50">
                        <Medal size={16} className="text-orange-400" />
                      </div>
                    );
                  } else {
                    rankContent = (
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <span className="text-xs font-black text-slate-500">{idx + 1}</span>
                      </div>
                    );
                  }

                  return (
                    <motion.tr
                      key={event.eventId}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="px-6 py-4">
                        {rankContent}
                      </td>

                      {/* Event Name */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 capitalize text-sm leading-tight tracking-tight group-hover:text-orange-600 transition-colors truncate max-w-[280px]">
                          {event.eventName}
                        </div>
                      </td>

                      {/* Club */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-black capitalize tracking-widest px-3 py-1 rounded-full shadow-sm">
                          <Trophy size={10} className="text-slate-400 shrink-0" />
                          {event.clubShortForm}
                        </span>
                      </td>

                      {/* Registered */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-700 tabular-nums">{event.totalParticipants ?? 0}</span>
                      </td>

                      {/* Present */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-700 tabular-nums">{event.totalAttendance ?? 0}</span>
                      </td>

                      {/* Show-up Rate */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${rate}%` }}
                              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 + idx * 0.04 }}
                              className={`h-full bg-gradient-to-r ${rateColor.bar} rounded-full`}
                            />
                          </div>
                          <span className={`text-sm font-black tabular-nums ${rateColor.text}`}>
                            {rate}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
