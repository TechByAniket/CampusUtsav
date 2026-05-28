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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-100">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-orange-500/10 text-orange-700 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
            Analytics Overview
          </span>
          {isRefreshing && (
            <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
              <RefreshCw size={10} className="animate-spin" /> Syncing...
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Executive Overview & Analytics
          </h2>
        </div>
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
