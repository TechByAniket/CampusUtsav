import { EventRequestCard } from "./EventRequestCard"

export const InboxList: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="text-center text-gray-500 py-20">
        No event requests found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <EventRequestCard key={item.id} item={item} />
      ))}
    </div>
  )
}
