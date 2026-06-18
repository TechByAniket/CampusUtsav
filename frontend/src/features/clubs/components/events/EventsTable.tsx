import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin as MapPinIcon, 
  Clock as ClockIcon, 
  ImageIcon, 
  Info, 
  ChevronRight, 
  Filter, 
  Check, 
  LayoutDashboard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { EventSummary } from '@/types/event';

interface EventsTableProps {
  events: EventSummary[];
  isLoading: boolean;
  availableStatuses: string[];
  selectedStatuses: string[];
  onStatusToggle: (status: string) => void;
  onClearFilters: () => void;
  onViewStatus: (event: EventSummary) => void;
  onNavigateToEvent: (id: number) => void;
}

const formatEventDate = (startDate: string, endDate: string) => {
  if (!startDate) return "";
  if (!endDate || startDate === endDate) {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return startDate;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } else {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${startDate} – ${endDate}`;
    const day1 = d1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const day2 = d2.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${day1} – ${day2}`;
  }
};

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  isLoading,
  availableStatuses,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  onViewStatus,
  onNavigateToEvent
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REVERTED': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'HOD_APPROVED': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'FACULTY1_APPROVED': return 'bg-violet-50 text-violet-600 border-violet-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 min-h-[500px]">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Active Submissions</h2>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">{events.length} Records</span>
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedStatuses.length > 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'}`}
          >
            <Filter size={14} /> {selectedStatuses.length > 0 ? `${selectedStatuses.length} Selected` : 'Filter Status'}
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 z-[60] overflow-hidden"
              >
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Select Statuses</p>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto no-scrollbar">
                  {availableStatuses.map(status => (
                    <button
                      key={status}
                      onClick={() => onStatusToggle(status)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <span className={`text-[11px] font-bold uppercase tracking-tight ${selectedStatuses.includes(status) ? 'text-indigo-600' : 'text-slate-600'}`}>
                        {status.replace('_', ' ')}
                      </span>
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedStatuses.includes(status) ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white border-slate-200'}`}>
                        {selectedStatuses.includes(status) && <Check size={12} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedStatuses.length > 0 && (
                  <div className="p-2 border-t border-slate-50 bg-slate-50/30">
                    <button
                      onClick={onClearFilters}
                      className="w-full py-2 text-[9px] font-black uppercase text-indigo-600 hover:bg-white rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-40 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
              <LayoutDashboard size={40} />
            </div>
            <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No matching events found</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Event Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Schedule & Logistics</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Submission Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-md shrink-0 relative">
                        {event.posterUrl ? (
                          <img src={event.posterUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-slate-800 uppercase text-sm truncate max-w-[280px] group-hover:text-indigo-600 transition-colors leading-tight">{event.title}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50">#{event.id}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.eventCategory}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-slate-700 uppercase tracking-tight">
                        <CalendarIcon size={13} className="text-indigo-500" /> {formatEventDate(event.startDate, event.endDate)}
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <MapPinIcon size={12} className="text-slate-300" /> {event.venue || "TBD"}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border w-fit shadow-sm ${getStatusStyles(event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                        <ClockIcon size={11} className="text-slate-300" /> {event.startTime?.slice(0, 5)}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewStatus(event)}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                      >
                        Status <Info size={14} />
                      </button>
                      <button
                        onClick={() => onNavigateToEvent(event.id)}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg transition-all active:scale-95 group/btn flex items-center gap-2 shadow-xl shadow-slate-100"
                      >
                        View Event <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
