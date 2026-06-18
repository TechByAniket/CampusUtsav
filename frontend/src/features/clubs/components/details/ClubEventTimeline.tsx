import React from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingEvents } from "../UpcomingEvents";
import { PastEvents } from "../PastEvents";

import type { EventSummary } from '@/types/event';

interface ClubEventTimelineProps {
  events: EventSummary[];
}

export const ClubEventTimeline: React.FC<ClubEventTimelineProps> = ({ events }) => {
  const now = new Date();
  
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.endDate || e.startDate);
    return eventDate >= now || eventDate.toDateString() === now.toDateString();
  });

  const pastEvents = events.filter(e => {
    const eventDate = new Date(e.endDate || e.startDate);
    return eventDate < now && eventDate.toDateString() !== now.toDateString();
  });

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-[11px] font-black text-slate-900 tracking-widest uppercase leading-none">Event Portfolio</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Engagement Timeline</p>
          </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-slate-50 p-1 rounded-xl mb-8 w-full md:w-fit flex border border-slate-100">
          <TabsTrigger value="upcoming" className="flex-1 md:flex-none px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
            Live Showcase ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1 md:flex-none px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-600 data-[state=active]:shadow-sm transition-all">
            Archives ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <UpcomingEvents events={upcomingEvents as any} />
        </TabsContent>

        <TabsContent value="past" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <PastEvents events={pastEvents as any} />
        </TabsContent>
      </Tabs>
    </div>
  );
};


