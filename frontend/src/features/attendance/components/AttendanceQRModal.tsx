import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Clock, RefreshCw, Play, Square } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { AdminEventDetail } from '@/types/event';

interface AttendanceQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: AdminEventDetail;
  currentTime: Date;
  fetchingToken: boolean;
  token: string | null;
  sessionTimes: { start: string | null; end: string | null };
  timeLeft: number;
}

export const AttendanceQRModal: React.FC<AttendanceQRModalProps> = ({
  isOpen,
  onClose,
  event,
  currentTime,
  fetchingToken,
  token,
  sessionTimes,
  timeLeft
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all z-20"
            >
              <XCircle size={18} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6">
                <span className="text-[10px] font-black text-sky-300 uppercase tracking-[0.4em]">Smart Attendance</span>
              </div>

              <h3 className="text-xl font-black text-amber-200 tracking-tight uppercase mb-1 line-clamp-1">{event.title}</h3>
              <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest mb-6 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                <Clock size={14} className="text-sky-300" />
                <span className="text-sm tabular-nums">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <p className="text-indigo-100 text-[9px] font-bold uppercase tracking-[0.3em] mb-6 px-4">Scan & Mark Attendance</p>

              <div className="bg-white p-5 rounded-3xl shadow-2xl mb-6 relative">
                {fetchingToken && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
                    <RefreshCw size={24} className="text-indigo-600 animate-spin" />
                  </div>
                )}
                {token ? (
                  <div className="space-y-4">
                    <QRCodeSVG value={token} size={180} level="H" includeMargin={true} />
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-6">
                      {sessionTimes.start && (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            <Play size={7} className="text-emerald-500" fill="currentColor" /> Start
                          </div>
                          <p className="text-[10px] font-bold text-slate-600 leading-none">
                            {new Date(sessionTimes.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                      {sessionTimes.end && (
                        <div className="flex flex-col gap-1 border-l border-slate-100 pl-6">
                          <div className="flex items-center justify-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            <Square size={7} className="text-rose-500" fill="currentColor" /> End
                          </div>
                          <p className="text-[10px] font-bold text-slate-600 leading-none">
                            {new Date(sessionTimes.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-[180px] h-[180px] bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                    <RefreshCw size={24} className="text-slate-300 animate-spin" />
                  </div>
                )}
              </div>

              <div className="w-full max-w-[240px] space-y-4">
                <div className="flex items-center justify-between text-white/80 text-[10px] font-black uppercase tracking-widest px-1">
                  <span>Rotate</span>
                  <span className="tabular-nums">{timeLeft}s</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
                <p className="text-indigo-200 text-[8px] font-bold leading-relaxed uppercase tracking-tight opacity-70 pt-2">
                  Token updates automatically every 30s
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
