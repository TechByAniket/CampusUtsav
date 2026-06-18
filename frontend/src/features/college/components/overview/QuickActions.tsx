import React from 'react';
import { Plus, ArrowRight, Clock } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="col-span-12 lg:col-span-5 space-y-8">
      {/* Create Card */}
      <div className="bg-indigo-600 text-white rounded-[1.5rem] p-8 flex flex-col justify-between h-56 group cursor-pointer overflow-hidden relative shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Plus size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-none uppercase">
            Create New <br/> Campus Initiative
          </h3>
        </div>
        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] relative z-10">
          Get Started <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      
      {/* Deadline Card */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 flex items-center justify-between shadow-sm transition-all hover:border-slate-200">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Next Deadline</p>
            <h4 className="font-bold text-slate-900 text-sm uppercase mt-2 tracking-tight">TechFest 2024</h4>
          </div>
        </div>
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100/50">
          2H Left
        </span>
      </div>
    </div>
  );
};
