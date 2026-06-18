import React from 'react';
import { Play, Square, QrCode, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface AttendanceActionsProps {
  isClubAdmin: boolean;
  attendanceActive: boolean;
  loading: boolean;
  errorNotice: string | null;
  timeLeft: number;
  onStart: () => void;
  onStop: () => void;
  onDisplayQr: () => void;
  onSync: () => void;
}

export const AttendanceActions: React.FC<AttendanceActionsProps> = ({
  isClubAdmin,
  attendanceActive,
  loading,
  errorNotice,
  timeLeft,
  onStart,
  onStop,
  onDisplayQr,
  onSync
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-slate-50">
      {/* Error Notice - Only for Club Admins */}
      {isClubAdmin && errorNotice && (
        <div className="w-full flex items-center gap-3 px-5 py-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 mb-2">
          <AlertCircle size={16} />
          <span className="text-[11px] font-bold uppercase tracking-tight">{errorNotice}</span>
        </div>
      )}

      {/* Attendance Control Actions - Only for Club Admins */}
      {isClubAdmin && (
        <>
          {!attendanceActive ? (
            <Button
              onClick={onStart}
              className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest gap-2.5 shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              <Play size={14} fill="currentColor" /> Start Attendance
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={onStop}
                variant="outline"
                className="h-12 px-8 rounded-xl border-rose-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 font-black text-[10px] uppercase tracking-widest gap-2.5 shadow-sm transition-all active:scale-95"
              >
                <Square size={14} fill="currentColor" /> Stop Attendance
              </Button>
              <Button
                onClick={onDisplayQr}
                className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest gap-2.5 shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                <QrCode size={14} /> Display QR
              </Button>
              
              {/* Rotation Timer */}
              <div className="hidden sm:flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rotate</span>
                  <span className="text-[11px] font-black text-slate-900 tabular-nums">{timeLeft}s</span>
                </div>
                <div className="w-10 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500"
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Sync Button - Visible to all for data freshness */}
      <Button
        onClick={onSync}
        disabled={loading}
        variant="outline"
        className="h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest gap-2.5 px-6 shadow-sm"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
      </Button>
    </div>
  );
};
