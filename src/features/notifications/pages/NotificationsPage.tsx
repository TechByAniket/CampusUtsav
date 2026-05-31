import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications, checkIfUnread, type NotificationResponse } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, CheckCheck, Loader2, Search, X, ChevronDown, Filter, Calendar } from "lucide-react";
import { toast } from "sonner";

// Relative time helper
const getRelativeTime = (dateString: string): string => {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    
    if (isNaN(date.getTime())) return "Some time ago";
    if (diffMs < 0) return "Just now";

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch (error) {
    return "Some time ago";
  }
};

const DropdownSelect = ({
  label,
  options,
  selected,
  onSelect,
  icon: Icon
}: {
  label: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (val: string) => void;
  icon: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selected);

  return (
    <div className="relative font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 text-[11px] font-black text-orange-700 outline-none transition-all hover:bg-orange-100 min-w-[145px] justify-between shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-orange-400" />
          <span className="uppercase tracking-widest whitespace-nowrap">
            {selectedOption ? selectedOption.label : `ALL ${label}S`}
          </span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group/item"
                >
                  <div
                    className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                      selected === opt.value
                        ? "bg-orange-600 border-orange-600"
                        : "border-slate-300 group-hover/item:border-orange-400"
                    }`}
                  >
                    {selected === opt.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name={label}
                    className="hidden"
                    checked={selected === opt.value}
                    onChange={() => {
                      onSelect(opt.value);
                      setIsOpen(false);
                    }}
                  />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight truncate">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [dateFilter, setDateFilter] = useState<"ALL" | "TODAY" | "YESTERDAY" | "WEEK">("ALL");

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
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm animate-pulse shrink-0">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Stay updated with your latest system activities and alerts.
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
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm mb-10 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Search input */}
            <div className="flex-1 max-w-xl relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-14 pr-12 py-4 bg-slate-50 border border-slate-200/60 rounded-3xl text-sm font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest outline-none focus:border-orange-300 focus:bg-white transition-all text-slate-900 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200/50 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full transition-all"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Right: Filters Dropdown select tools */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden xl:block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                <Filter size={12} className="inline mr-1" /> Filters:
              </div>

              <DropdownSelect
                label="STATUS"
                options={[
                  { label: "ALL STATUSES", value: "ALL" },
                  { label: "UNREAD", value: "UNREAD" },
                  { label: "READ", value: "READ" }
                ]}
                selected={statusFilter}
                onSelect={(val: any) => setStatusFilter(val)}
                icon={Filter}
              />

              <DropdownSelect
                label="DATE"
                options={[
                  { label: "ALL TIME", value: "ALL" },
                  { label: "TODAY", value: "TODAY" },
                  { label: "YESTERDAY", value: "YESTERDAY" },
                  { label: "THIS WEEK", value: "WEEK" }
                ]}
                selected={dateFilter}
                onSelect={(val: any) => setDateFilter(val)}
                icon={Calendar}
              />

              {(searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setDateFilter("ALL");
                  }}
                  className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-rose-500 px-2 transition-colors shrink-0"
                >
                  Reset
                </button>
              )}
            </div>

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
          {filteredNotifications.map((n) => {
            const isUnread = checkIfUnread(n);
            return (
              <Card
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`
                  group relative flex flex-col overflow-hidden rounded-2xl border px-4 py-3
                  transition-all duration-300 cursor-pointer
                  ${
                    isUnread
                      ? "border-orange-100 bg-orange-50/20 hover:bg-orange-50/40 shadow-sm"
                      : "border-slate-200/80 bg-white hover:bg-slate-50/50"
                  }
                  hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)]
                `}
              >
                {/* Decorative Status Bar (Side) */}
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 transition-colors ${
                    isUnread ? "bg-orange-500" : "bg-slate-200"
                  }`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                      )}
                      <h4
                        className={`text-base tracking-tight transition-colors text-slate-900 group-hover:text-orange-500 ${
                          isUnread ? "font-bold" : "font-normal"
                        }`}
                      >
                        {n.title}
                      </h4>
                    </div>
                    
                    <p
                      className={`text-sm leading-relaxed font-normal ${
                        isUnread ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {n.message}
                    </p>
                  </div>

                  {/* Relative Timestamp */}
                  <div className="flex items-center shrink-0 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-500 transition-colors px-2.5 py-0.5">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-500">
                      {getRelativeTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                {(n.redirectUrl || isUnread) && (
                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-100/60 pt-2">
                    {n.redirectUrl ? (
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors bg-orange-50 hover:bg-orange-100/80 px-2.5 py-1 rounded-xl">
                        Take Action
                        <span className="transition-transform group-hover:translate-x-0.5 inline-block ml-1">➜</span>
                      </span>
                    ) : (
                      <span />
                    )}

                    {isUnread && (
                      <Button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await markAsRead(n.id);
                            toast.success("Marked as read");
                          } catch (err) {
                            toast.error("Failed to mark as read");
                          }
                        }}
                        size="sm"
                        className="h-7 rounded-xl px-2.5 text-[10px] font-extrabold uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1 active:scale-95 transition-all shadow-md shadow-orange-100"
                      >
                        <CheckCheck className="h-3.5 w-3.5 text-white" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
