import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PrincipalOverviewHeaderProps {
  isRefreshing: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export const PrincipalOverviewHeader: React.FC<PrincipalOverviewHeaderProps> = ({
  isRefreshing,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
          Executive Overview
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
          Monitor campus-wide engagement and live analytics
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading || isRefreshing}
        className="self-start md:self-center flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider h-11 px-5 rounded-2xl shadow-sm hover:shadow transition-all disabled:opacity-50"
      >
        <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
        Refresh Stats
      </button>
    </div>
  );
};
