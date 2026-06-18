import React from 'react';
import { Sparkles } from 'lucide-react';

export const ExploreHero = () => {
  return (
    <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100/60 overflow-hidden">
      {/* Subtle Light Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="relative z-10 space-y-4">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50/50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-100/50">
            <Sparkles size={12} className="text-orange-400" />
            <span>Live Event Portal</span>
         </div>
         <div className="space-y-2">
           <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Explore <span className="text-orange-600">Events</span>
           </h1>
           <p className="text-slate-400 font-bold text-xs md:text-[13px] tracking-tight max-w-xl leading-relaxed">
              Discover and join the most vibrant community activities, technical fests, and cultural celebrations across your institution.
           </p>
         </div>
      </div>
    </header>
  );
};
