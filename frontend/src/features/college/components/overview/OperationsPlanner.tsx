import React from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { CalendarComponent } from '../../components/CalendarComponent';
import { SectionHeader } from './SectionHeader';

export const OperationsPlanner: React.FC = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Operations Planner" 
        subtitle="Daily campus activities" 
        icon={<CalendarIcon size={16} className="text-amber-600" />} 
        rightElement={
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline transition-all">
            View All Events
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm min-h-[500px]">
          <CalendarComponent />
        </div>
        <div className="xl:col-span-1 bg-slate-50/40 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col justify-center items-center text-center p-10 group cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-6 group-hover:scale-110 group-hover:text-indigo-400 transition-all border border-slate-100">
            <Plus size={28} />
          </div>
          <h5 className="font-black text-slate-900 text-[11px] uppercase tracking-tight">Add Spotlight</h5>
          <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-tight leading-relaxed max-w-[140px]">
            Promote high-impact events to the student feed.
          </p>
        </div>
      </div>
    </div>
  );
};
