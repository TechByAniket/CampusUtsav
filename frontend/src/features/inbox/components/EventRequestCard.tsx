import { StatusBadge } from "./StatusBadge"

export const EventRequestCard: React.FC<{ item: any }> = ({ item }) => {
  const isPending = item.status === "pending";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)]">
      
      {/* Decorative Status Bar (Side) */}
      <div className={`absolute left-0 top-0 h-full w-1 transition-colors ${
        item.status === 'pending' ? 'bg-yellow-500' :
        item.status === 'needs-change' ? 'bg-sky-500' :
        item.status === 'approved' ? 'bg-green-600' :
        'bg-red-500'
      }`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            {/* <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {item.status}
            </span> */}
          </div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{item.club}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{item.startDate === item.endDate ? item.startDate : `${item.startDate} – ${item.endDate}`}</span>
          </div>
        </div>

        {/* Floating Icon/Graphic */}
        

      {/* Floating Calendar Icon with Date */}
      <div className="flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors px-2 py-1">
        {/* Calendar Icon */}
        {/* <CalendarDays className="h-5 w-5 mb-1" /> */}

        {/* Last Updated Date */}
        <span className="text-xs font-medium text-slate-500">{item.requestDate}</span>
      </div>

      </div>

      {/* Action Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <button className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors">
          View Details
        </button>
        
        <div className="flex gap-2">
          {isPending ? (
            <>
              <button className="rounded-full px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
                Needs Info
              </button>
              <button className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all">
                Approve
              </button>
            </>
          ) : (
            <div className="text-[10px] font-medium text-slate-400 italic">
              Processed on {new Date().toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};