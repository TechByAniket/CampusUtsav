import * as React from "react"
import { formatDateRange } from "little-date"
import { Calendar } from "@/components/ui/calendar"
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Bell, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'

// Mock database of events keyed by date string (YYYY-MM-DD)
const MOCK_EVENTS: Record<string, any[]> = {
  "2025-06-12": [
    { title: "Annual Tech Symposium", from: "2025-06-12T09:00:00", to: "2025-06-12T17:00:00", type: "Technical", location: "Main Hall" },
    { title: "Cultural Night Prep", from: "2025-06-12T18:00:00", to: "2025-06-12T20:00:00", type: "Cultural", location: "Auditorium" },
    { title: "Sports Meet Registration", from: "2025-06-12T10:00:00", to: "2025-06-12T14:00:00", type: "Sports", location: "Gymkhana" },
  ],
  "2025-06-15": [
    { title: "Inter-College Debate", from: "2025-06-15T11:00:00", to: "2025-06-15T14:00:00", type: "Technical", location: "Seminar Room 1" },
    { title: "Hackathon Kickoff", from: "2025-06-15T16:00:00", to: "2025-06-15T18:00:00", type: "Technical", location: "IT Lab" },
  ],
  "2025-06-18": [
    { title: "Photography Workshop", from: "2025-06-18T14:00:00", to: "2025-06-18T17:00:00", type: "Cultural", location: "Art Studio" },
  ],
  "2026-04-24": [
    { title: "Dashboard Redesign Review", from: "2026-04-24T10:00:00", to: "2026-04-24T11:00:00", type: "Technical", location: "Meeting Room" },
    { title: "Staff Sync", from: "2026-04-24T14:00:00", to: "2026-04-24T15:00:00", type: "General", location: "Principal Office" },
  ]
};

export const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())

  // Format date to YYYY-MM-DD for lookup
  const dateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : "";
  const eventsForDay = MOCK_EVENTS[dateKey] || [];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
      {/* Left side: Calendar */}
      <div className="w-full md:w-[45%] p-8 border-r border-slate-50 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8 self-start">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CalendarIcon size={20} />
            </div>
            <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Event Calendar</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a date to view events</p>
            </div>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full scale-105"
          classNames={{
            day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl transition-all font-bold",
            day_today: "bg-slate-100 text-slate-900 rounded-2xl font-bold border-2 border-indigo-200",
            head_cell: "text-slate-400 font-black uppercase text-[10px] tracking-widest pb-6",
            button: "hover:bg-slate-50 rounded-xl transition-colors",
            day: "h-12 w-12 p-0 font-medium aria-selected:opacity-100",
            nav_button: "hover:bg-slate-50 rounded-xl transition-colors p-2",
          }}
        />
      </div>

      {/* Right side: Event List */}
      <div className="flex-1 p-10 bg-slate-50/30 flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule for</h4>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              {selectedDate?.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Plus size={14} /> Add Event
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full space-y-4 pr-2 custom-scrollbar overflow-y-auto"
            >
              {eventsForDay.length > 0 ? (
                eventsForDay.map((event, i) => (
                  <EventItem key={i} event={event} i={i} />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[2rem]">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <Clock size={32} />
                  </div>
                  <h5 className="text-lg font-black text-slate-400 uppercase tracking-tight mb-2">No Events Found</h5>
                  <p className="text-xs font-medium text-slate-400 max-w-[200px]">There are no campus activities scheduled for this day.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const EventItem = ({ event, i }: { event: any, i: number }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="group bg-white border border-slate-100 p-6 rounded-[2rem] transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-indigo-100"
  >
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
            event.type === 'Technical' ? 'bg-indigo-50 text-indigo-600' : 
            event.type === 'Cultural' ? 'bg-violet-50 text-violet-600' : 
            event.type === 'Sports' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {event.type}
          </span>
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
            <Clock size={10} /> {new Date(event.from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <h5 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-3 group-hover:text-indigo-600 transition-colors uppercase">
            {event.title}
        </h5>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <MapPin size={12} className="text-indigo-400" /> {event.location}
            </div>
        </div>
      </div>
      <button className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
        <Bell size={18} />
      </button>
    </div>
  </motion.div>
);


