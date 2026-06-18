import React from 'react';
import { Shapes, BarChart3 } from 'lucide-react';
import { EventsByClubs } from '@/features/analytics/components/EventsByClubs';
import { EventsByCategory } from '@/features/analytics/components/EventsByCategory';
import { SectionHeader } from '../overview/SectionHeader';

export const AnalyticsHub: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8 bg-white rounded-[1.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-slate-200">
        <SectionHeader 
          title="Activity by Clubs" 
          subtitle="Most active student chapters" 
          icon={<Shapes size={16} className="text-indigo-600" />} 
        />
        <div className="mt-8">
          <EventsByClubs />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 bg-white rounded-[1.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:border-slate-200">
        <SectionHeader 
          title="Activity by Category" 
          subtitle="Distribution of events" 
          icon={<BarChart3 size={16} className="text-violet-600" />} 
        />
        <div className="mt-8">
          <EventsByCategory />
        </div>
      </div>
    </div>
  );
};
