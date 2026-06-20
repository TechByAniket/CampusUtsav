import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

import { getAllEventsByCollege } from '@/services/eventService';
import type { EventSummary } from '@/types/event';
import type { RootState } from '@/store/store';
import { EventListCard } from '@/features/events/components/EventListCard';
import { ExploreFilterBar } from '../components/ExploreFilterBar';
import { ExploreHero } from '../components/ExploreHero';
import { NoEventsFound } from '../components/NoEventsFound';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

export const ExploreEventsPage = () => {
  const navigate = useNavigate();
  const collegeId = useSelector((state: RootState) => state.auth.collegeId);
  
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!collegeId) return;
      setLoading(true);
      try {
        const data = await getAllEventsByCollege(collegeId);
        setEvents(data || []);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [collegeId]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           e.clubNameShortForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(e.eventCategory);
      const matchesClub = selectedClubs.length === 0 || selectedClubs.includes(e.clubNameShortForm);
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(e.status);

      return matchesSearch && matchesCategory && matchesClub && matchesStatus;
    });
  }, [events, searchQuery, selectedCategories, selectedClubs, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery(""); 
    setSelectedCategories([]); 
    setSelectedClubs([]); 
    setSelectedStatus([]);
  };

  if (!collegeId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-4 text-center bg-white font-sans">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-sm shadow-slate-100">
           <Info size={40} />
        </div>
        <div className="space-y-3">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
           <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm leading-relaxed uppercase tracking-[0.1em]">
             There are no public events available at this time. <br />
             <span className="text-indigo-600 font-bold">Please log in</span> to explore your campus activity.
           </p>
        </div>
        <button 
          onClick={() => navigate('/auth/sign-in')}
          className="px-12 h-14 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
           Log In Here
        </button>
      </div>
    );
  }

  // Early return for loading removed. Handled below.

  return (
    <section className="w-full min-h-screen bg-white py-12 px-4 md:px-10 lg:px-16 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <ExploreHero />

        <ExploreFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          selectedClubs={selectedClubs}
          onClubsChange={setSelectedClubs}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          collegeId={collegeId}
        />

        {loading ? (
          <PageSkeleton layout="grid" />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredEvents.map((event) => (
                  <EventListCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => navigate(`events/${event.id}`)}
                  />
                ))}
              </motion.div>
            ) : (
              <NoEventsFound onClearFilters={clearFilters} />
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
;