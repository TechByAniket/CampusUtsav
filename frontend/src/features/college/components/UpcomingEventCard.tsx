import React from 'react';
import { CalendarDays, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Event } from "@/types/event";

export type UpcomingEventCardProps = Event;

const formatEventDate = (startDate: string, endDate: string) => {
  if (!startDate) return "";
  if (!endDate || startDate === endDate) {
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return startDate;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } else {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return `${startDate} – ${endDate}`;
    const day1 = d1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const day2 = d2.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${day1} – ${day2}`;
  }
};

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = (event) => {
  return (
    <div
      className="
        relative w-full aspect-[4/5]
        rounded-2xl overflow-hidden
        cursor-pointer group shadow-lg hover:shadow-2xl
        transition-transform duration-300 ease-out hover:scale-[1.03]
        bg-black
      "
    >
      {/* Full Poster */}
      <img
        src={event.posterUrl}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-contain object-center"
      />

      {/* Gradient Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/100 via-black/50 to-transparent
        "
      />

      {/* Event Details */}
      <div className="absolute bottom-0 w-full p-4 flex flex-col gap-2 text-white">
        
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-white/90 text-gray-800 text-xs rounded-full font-medium w-fit">
          {event.eventCategory}
        </span>

        {/* Title */}
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">
          {event.title}
        </h3>

        {/* Venue + Club */}
        <div className="flex items-center gap-2 text-xs text-white/90 truncate">
          <MapPin size={14} className="shrink-0" />
          <span>{event.venue}</span>
          <span className="opacity-50">•</span>
          <span>{(event as any).club?.name || (event as any).clubName}</span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-xs text-white/90">
          <CalendarDays size={12} />
          <div className="flex flex-col">
            <span className="font-semibold">
              {formatEventDate(event.startDate, event.endDate)}
            </span>
            <span className="text-[10px]">
              {event.startTime} – {event.endTime}
            </span>
          </div>
        </div>

        {/* CTA */}
        
          <Button
            size="sm"
            className="
              w-full text-xs rounded-[8px]
              border border-orange-400
              text-orange-400
              bg-transparent
              hover:bg-primary hover:text-white
              transition
            "
          >
            View
          </Button>
        
      </div>
    </div>
  );
};