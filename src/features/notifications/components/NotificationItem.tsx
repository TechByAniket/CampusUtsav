import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCheck } from "lucide-react";
import { checkIfUnread, type NotificationResponse } from "@/hooks/useNotifications";

export const getNotificationColor = (type: string) => {
  switch (type) {
    case 'ACCOUNT_ACTIVATION_REQUEST':
    case 'ACCOUNT_STATUS_CHANGE':
    case 'ROLE_UPDATE':
    case 'ACCOUNT_CREATION':
    case 'CLUB_ASSIGNMENT_CHANGE':
      return { bg: 'bg-indigo-500', text: 'text-indigo-600', lightBg: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-100/80', border: 'border-indigo-100', pulse: 'shadow-indigo-500/50', hoverText: 'group-hover:text-indigo-600', buttonHover: 'hover:bg-indigo-600' };

    case 'EVENT_SUBMITTED':
    case 'EVENT_STATUS_CHANGE':
    case 'EVENT_UPDATED':
    case 'EVENT_CANCELLED':
    case 'EVENT_COMPLETED':
      return { bg: 'bg-rose-500', text: 'text-rose-600', lightBg: 'bg-rose-50', hoverBg: 'hover:bg-rose-100/80', border: 'border-rose-100', pulse: 'shadow-rose-500/50', hoverText: 'group-hover:text-rose-600', buttonHover: 'hover:bg-rose-600' };

    case 'TEAM_INVITE':
    case 'TEAM_UPDATE':
    case 'TEAM_LEADER_CHANGED':
      return { bg: 'bg-emerald-500', text: 'text-emerald-600', lightBg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100/80', border: 'border-emerald-100', pulse: 'shadow-emerald-500/50', hoverText: 'group-hover:text-emerald-600', buttonHover: 'hover:bg-emerald-600' };

    case 'REGISTRATION_STATUS_CHANGE':
      return { bg: 'bg-purple-500', text: 'text-purple-600', lightBg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100/80', border: 'border-purple-100', pulse: 'shadow-purple-500/50', hoverText: 'group-hover:text-purple-600', buttonHover: 'hover:bg-purple-600' };

    case 'ATTENDANCE_MARKED':
      return { bg: 'bg-cyan-500', text: 'text-cyan-600', lightBg: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-100/80', border: 'border-cyan-100', pulse: 'shadow-cyan-500/50', hoverText: 'group-hover:text-cyan-600', buttonHover: 'hover:bg-cyan-600' };

    case 'ANNOUNCEMENT':
    case 'ALERT':
    default:
      return { bg: 'bg-orange-500', text: 'text-orange-600', lightBg: 'bg-orange-50', hoverBg: 'hover:bg-orange-100/80', border: 'border-orange-100', pulse: 'shadow-orange-500/50', hoverText: 'group-hover:text-orange-600', buttonHover: 'hover:bg-orange-600' };
  }
};

export const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};

export const NotificationItem = ({
  n,
  onClick,
  onMarkRead,
}: {
  n: NotificationResponse;
  onClick: (n: NotificationResponse) => void;
  onMarkRead: (e: React.MouseEvent, id: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUnread = checkIfUnread(n);
  const colors = getNotificationColor(n.type);

  // Consider message "long" if it's over 60 characters
  const isLongMessage = n.message && n.message.length > 60;

  return (
    <Card
      onClick={() => onClick(n)}
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border px-4 py-3
        transition-all duration-300 cursor-pointer
        ${
          isUnread
            ? `${colors.border} ${colors.lightBg}/30 ${colors.hoverBg} shadow-sm`
            : "border-slate-200/80 bg-white hover:bg-slate-50/50"
        }
        hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.04)]
      `}
    >
      {/* Decorative Status Bar (Side) */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 transition-colors ${
          isUnread ? colors.bg : "bg-slate-200"
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            {isUnread && (
              <span className={`h-2 w-2 rounded-full ${colors.bg} shrink-0 animate-pulse`} />
            )}
            <h4
              className={`text-base tracking-tight transition-colors text-slate-900 ${colors.hoverText} ${
                isUnread ? "font-bold" : "font-normal"
              }`}
            >
              {n.title}
            </h4>
          </div>
          
          <div>
            <p
              className={`text-sm leading-relaxed font-normal ${
                isUnread ? "text-slate-700" : "text-slate-400"
              } ${!isExpanded && isLongMessage ? "line-clamp-1 md:line-clamp-none" : ""}`}
            >
              {n.message}
            </p>
            {isLongMessage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="md:hidden mt-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
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
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${colors.text} transition-colors ${colors.lightBg} ${colors.hoverBg} px-2.5 py-1 rounded-xl`}>
              Take Action
              <span className="transition-transform group-hover:translate-x-0.5 inline-block ml-1">➜</span>
            </span>
          ) : <div />}

          {isUnread && (
            <button
              onClick={(e) => onMarkRead(e, n.id)}
              className={`h-7 rounded-xl px-2.5 text-[10px] font-extrabold uppercase tracking-wider ${colors.bg} ${colors.buttonHover} text-white flex items-center gap-1 active:scale-95 transition-all shadow-md ${colors.pulse}`}
            >
              <CheckCheck className="h-3.5 w-3.5 text-white" />
              Mark as Read
            </button>
          )}
        </div>
      )}
    </Card>
  );
};
