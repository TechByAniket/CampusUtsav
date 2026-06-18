import React from 'react';
import { ChevronLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AdminEventDetail } from '@/types/event';
import { AttendanceActions } from './AttendanceActions';

interface AttendanceHeaderProps {
  event: AdminEventDetail;
  attendanceActive: boolean;
  isClubAdmin: boolean;
  loading: boolean;
  errorNotice: string | null;
  timeLeft: number;
  onStart: () => void;
  onStop: () => void;
  onDisplayQr: () => void;
  onSync: () => void;
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

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  event,
  attendanceActive,
  isClubAdmin,
  loading,
  errorNotice,
  timeLeft,
  onStart,
  onStop,
  onDisplayQr,
  onSync
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 relative">
      {/* Navigation & Informative Header (Floating) */}
      <div className="relative z-[100]">
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-6 left-0 group flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-100 transition-all shadow-sm">
            <ChevronLeft size={18} className="text-indigo-600" />
          </div>
          <div className="flex flex-col items-start opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Return to Console</p>
          </div>
        </button>
      </div>

      {/* Informative Header Card */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10 pt-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6 min-w-0 flex-1">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight truncate">
                  {event.title} <span className="text-indigo-600 ml-2">Attendance</span>
                </h1>
                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${attendanceActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                  {attendanceActive ? 'LIVE SESSION' : 'INACTIVE'}
                </div>
              </div>

              {/* Event Quick Details Bar */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4">
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                  <Calendar size={13} className="text-indigo-500" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{formatEventDate(event.startDate, event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                  <Clock size={13} className="text-indigo-500" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{event.startTime?.slice(0, 5)} - {event.endTime?.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                  <MapPin size={13} className="text-indigo-500" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight truncate max-w-[250px]">{event.venue}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <AttendanceActions 
                isClubAdmin={isClubAdmin}
                attendanceActive={attendanceActive}
                loading={loading}
                errorNotice={errorNotice}
                timeLeft={timeLeft}
                onStart={onStart}
                onStop={onStop}
                onDisplayQr={onDisplayQr}
                onSync={onSync}
              />
            </div>
          </div>

          {/* Event Poster (Desktop Only) */}
          <div className="hidden lg:block shrink-0">
            <div className="w-48 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 group">
              <img
                src={event.posterUrl}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
