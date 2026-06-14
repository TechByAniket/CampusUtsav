import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

import { getAllEventsByCollege } from '@/services/eventService';
import type { EventSummary } from '@/types/event';
import type { RootState } from '@/store/store';
import { EventListCard } from '../../../events/components/EventListCard';
import { ExploreFilterBar } from '../../../home/components/ExploreFilterBar';

export const Events = () => {
  const navigate = useNavigate();
  const collegeId = useSelector((state: RootState) => state.auth.collegeId);
  
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">Syncing Campus Events...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 pb-10">
      
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              Events Dashboard
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
              Manage and track all student-run events and activities
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <ExploreFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          selectedClubs={selectedClubs}
          onClubsChange={setSelectedClubs}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          collegeId={collegeId || ""}
        />

        {/* Grid Content */}
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredEvents.map((event) => (
                <EventListCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => navigate(`${event.id}`)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 flex flex-col items-center text-center space-y-4 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                 <AlertCircle size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black text-slate-900">No events matched your criteria</p>
                <p className="text-slate-400 text-sm font-medium">Try adjusting your search or filters to see more results.</p>
              </div>
              <button 
                onClick={clearFilters}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-xl shadow-indigo-100"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>


    </div>
  );
};
