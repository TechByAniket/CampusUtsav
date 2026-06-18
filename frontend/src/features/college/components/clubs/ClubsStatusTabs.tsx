import React from 'react';

interface ClubsStatusTabsProps {
  availableStatuses: string[];
  activeTab: string;
  clubs: any[];
  onTabChange: (tab: string) => void;
}

export const ClubsStatusTabs: React.FC<ClubsStatusTabsProps> = ({ 
  availableStatuses, 
  activeTab, 
  clubs, 
  onTabChange 
}) => {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
      {availableStatuses.map((tab) => (
        <button 
          key={tab} 
          onClick={() => onTabChange(tab)} 
          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
            activeTab === tab 
              ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
              : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {tab} ({clubs.filter(c => c.status === tab).length})
        </button>
      ))}
    </div>
  );
};
