import React from 'react';
import { Info } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/50 rounded-[2rem] border border-slate-150 text-center shadow-inner w-full">
      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-[1.25rem] flex items-center justify-center mb-4 text-slate-400">
        <Info size={24} />
      </div>
      <p className="text-slate-600 font-bold text-xs uppercase tracking-[0.2em]">{message}</p>
      <p className="text-slate-400 text-[11px] mt-1">Try tweaking your filter selections or refreshing the dashboard.</p>
    </div>
  );
};
