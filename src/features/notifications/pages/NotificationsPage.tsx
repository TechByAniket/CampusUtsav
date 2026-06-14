import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications, checkIfUnread, type NotificationResponse } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Loader2, Search, X, Filter, Activity, Calendar, XCircle, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { FilterSection } from "../components/FilterSection";
import { NotificationItem } from "../components/NotificationItem";

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [dateFilter, setDateFilter] = useState<"ALL" | "TODAY" | "YESTERDAY" | "WEEK">("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
  } = useNotifications();

  const filteredNotifications = notifications.filter((n) => {
    // 1. Search Query Filter
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Status Filter
    const isUnread = checkIfUnread(n);
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "UNREAD" && isUnread) ||
      (statusFilter === "READ" && !isUnread);

    // 3. Date Filter
    let matchesDate = true;
    if (dateFilter !== "ALL") {
      const now = new Date();
      const nDate = new Date(n.createdAt);
      const diffMs = now.getTime() - nDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (dateFilter === "TODAY") {
        matchesDate = diffDays === 0 && now.getDate() === nDate.getDate();
      } else if (dateFilter === "YESTERDAY") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        matchesDate =
          yesterday.getDate() === nDate.getDate() &&
          yesterday.getMonth() === nDate.getMonth() &&
          yesterday.getFullYear() === nDate.getFullYear();
      } else if (dateFilter === "WEEK") {
        matchesDate = diffDays <= 7;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleNotificationClick = async (n: NotificationResponse) => {
    const isUnread = checkIfUnread(n);
    if (isUnread) {
      try {
        await markAsRead(n.id);
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
    
    if (n.redirectUrl) {
      navigate(n.redirectUrl);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Loading Notifications...</p>
      </div>
    );
  }

  const hasUnread = unreadCount > 0;

  return (
    <div className="w-full space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
            Notifications
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1.5 tracking-wide">
            Stay updated with your latest system activities and alerts
          </p>
        </div>
        
        {hasUnread && (
          <Button
            onClick={handleMarkAllRead}
            disabled={isMarkingAllRead}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 active:scale-95 transition-all shadow-sm shrink-0"
          >
            {isMarkingAllRead ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5 text-orange-500" />
            )}
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Search & Filters Toolbar */}
      {notifications.length > 0 && (
        <div className="flex flex-row gap-3 items-center justify-between mb-10 w-full relative z-20">
          {/* Left: Search input */}
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-14 pr-12 py-3.5 bg-white border border-slate-200/60 rounded-full text-sm font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest outline-none focus:border-orange-300 transition-all text-slate-900 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full transition-all"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Right: Filter Trigger Button */}
          <div className="flex items-center gap-3 shrink-0 relative z-50">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2.5 px-5 py-3.5 border transition-all rounded-full font-black uppercase text-[11px] tracking-widest shadow-sm active:scale-95 ${isFilterOpen ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-white border-slate-200/60 hover:border-orange-300 hover:bg-slate-50 text-slate-700'}`}
            >
              <Filter size={16} className={isFilterOpen ? 'text-orange-600' : 'text-orange-500'} />
              <span className="hidden sm:inline">Filters</span>
              {(statusFilter !== "ALL" || dateFilter !== "ALL") && (
                <span className="w-5 h-5 flex items-center justify-center bg-orange-600 text-white rounded-full text-[10px]">
                  {(statusFilter !== "ALL" ? 1 : 0) + (dateFilter !== "ALL" ? 1 : 0)}
                </span>
              )}
            </button>
            
            {(searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL") && (
               <button 
                   onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                      setDateFilter("ALL");
                   }}
                   className="hidden md:flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 px-3 transition-colors"
               >
                   <XCircle size={14} /> Clear All
               </button>
            )}

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 w-[280px] sm:w-[320px] bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden z-50 flex flex-col max-h-[70vh]"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filters</h2>
                      <button onClick={() => setIsFilterOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                      <FilterSection
                        title="Status"
                        options={[
                          { label: "ALL STATUSES", value: "ALL" },
                          { label: "UNREAD", value: "UNREAD" },
                          { label: "READ", value: "READ" }
                        ]}
                        selected={statusFilter}
                        onSelect={(val: any) => setStatusFilter(val)}
                        icon={Activity}
                        colorClass="text-emerald-500"
                      />
                      <FilterSection
                        title="Time"
                        options={[
                          { label: "ALL TIME", value: "ALL" },
                          { label: "TODAY", value: "TODAY" },
                          { label: "YESTERDAY", value: "YESTERDAY" },
                          { label: "THIS WEEK", value: "WEEK" }
                        ]}
                        selected={dateFilter}
                        onSelect={(val: any) => setDateFilter(val)}
                        icon={Calendar}
                        colorClass="text-indigo-500"
                      />
                    </div>
                    
                    {(statusFilter !== "ALL" || dateFilter !== "ALL") && (
                       <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                         <button 
                           onClick={() => {
                             setStatusFilter("ALL");
                             setDateFilter("ALL");
                           }}
                           className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                         >
                           Reset All Filters
                         </button>
                       </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-[2rem] p-12 lg:p-20 text-center shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner animate-bounce">
            <Bell className="h-8 w-8" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">No notifications yet</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              You're all caught up. New updates and activities will appear here.
            </p>
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        /* Search/Filters Empty State */
        <div className="flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-[2rem] p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">No matching notifications</h3>
            <p className="text-xs text-slate-500">
              No results match your search or filters. Try adjusting them.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setDateFilter("ALL");
            }}
            className="h-8 rounded-xl px-4 text-xs font-black uppercase tracking-wider text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-orange-50/50 active:scale-95 transition-all"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        /* Notifications List */
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <NotificationItem 
              key={n.id} 
              n={n} 
              onClick={handleNotificationClick} 
              onMarkRead={handleMarkAsRead} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
