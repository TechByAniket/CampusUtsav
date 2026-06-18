import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface NoEventsFoundProps {
  onClearFilters: () => void;
}

export const NoEventsFound: React.FC<NoEventsFoundProps> = ({ onClearFilters }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-32 flex flex-col items-center text-center space-y-8 bg-slate-50/10 rounded-[4rem] border border-slate-100"
    >
      <div className="w-24 h-24 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-center text-slate-200 shadow-sm">
         <AlertCircle size={48} />
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">No Events Found</h3>
        <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm uppercase tracking-widest leading-relaxed">No events match your current search or filter criteria. <br />Try adjusting your settings.</p>
      </div>
      <button 
        onClick={onClearFilters}
        className="px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-xl shadow-slate-100"
      >
        Clear all filters
      </button>
    </motion.div>
  );
};
