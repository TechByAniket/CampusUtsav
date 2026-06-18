import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const DashboardHero = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20 pt-0 font-inter overflow-hidden">
      {/* 1. Subtle Mesh Background Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* ================= LEFT COLUMN: TEXT ================= */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* System Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-50/50 backdrop-blur-md border border-indigo-100/50 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">
              System Live • 12 Active Events
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[0.95]">
              Manage the Pulse <br />
              <span className="text-indigo-600">of Your Campus.</span>
            </h1>
            <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-xl leading-relaxed">
              Streamline event approvals, track real-time registrations, and boost student engagement across all departments from one central hub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center gap-2">
              <Plus size={18} /> Create New Event
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2">
              <Calendar size={18} /> View Event Calendar
            </button>
          </div>
        </motion.div>

        {/* ================= RIGHT COLUMN: VISUAL ================= */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative lg:ml-auto"
        >
          {/* Glass Card Mockup */}
          <div className="relative w-full max-w-md bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quick Stats</p>
                  <h3 className="text-xl font-bold text-slate-900">Registration Trend</h3>
                </div>
                <div className="p-3 bg-white/60 rounded-2xl border border-white shadow-sm text-indigo-600">
                  <Activity size={20} />
                </div>
              </div>

              {/* Mini Trend Line (SVG) */}
              <div className="h-24 w-full relative group">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M0,25 Q15,5 30,20 T60,10 T100,15"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              </div>

              {/* Performance Snippet */}
              <div className="pt-6 border-t border-white/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Last Event Perf.</p>
                            <p className="text-sm font-bold text-slate-900">92% Engagement</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">+14% Growth</p>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Element 1 */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 bg-white rounded-2xl shadow-xl border border-slate-50 text-indigo-600 hidden md:block"
          >
            <Plus size={24} strokeWidth={3} />
          </motion.div>

          {/* Floating Element 2 */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 -left-8 px-5 py-3 bg-white rounded-xl shadow-xl border border-slate-50 flex items-center gap-3 hidden md:block"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Analytics Online</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
