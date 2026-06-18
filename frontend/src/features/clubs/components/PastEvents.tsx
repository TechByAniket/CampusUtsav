import { UpcomingEventCard } from "@/features/college/components/UpcomingEventCard";
import type { Event } from "@/types/event";
import React from "react";


interface PastEventsProps {
  events: Event[];
}

export const PastEvents: React.FC<PastEventsProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <div>
          <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white h-full col-span-1 rounded-[8px]"
              >
                <UpcomingEventCard {...event} />
              </div>
            ))}
          </div>
        </div>
  );
};
