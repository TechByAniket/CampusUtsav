import React from 'react';
import { MapPin } from 'lucide-react';

export const Venues = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-200">
        <MapPin size={40} />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Venue Management</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">This module is under maintenance</p>
      </div>
    </div>
  );
};
