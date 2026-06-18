import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { OnePageCreateEventForm } from '@/features/events/components/CreateEventForm';

import type { Event } from '@/types/event';

interface ResubmitModalProps {
  event: Event;
  onClose: () => void;
  onSuccess?: () => void;
}

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'REVERTED': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'SUBMITTED': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'HOD_APPROVED': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
    case 'FACULTY1_APPROVED': return 'bg-violet-50 text-violet-600 border-violet-100';
    default: return 'bg-slate-50 text-slate-500 border-slate-200';
  }
};

export const ResubmitModal: React.FC<ResubmitModalProps> = ({ event, onClose, onSuccess }) => {
  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto no-scrollbar font-sans">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(234,88,12,0.12)] border border-orange-100/40 relative overflow-hidden my-auto"
      >
        {/* Premium Header matching Club Inbox edit modal */}
        <div className="px-8 py-6 border-b border-orange-100/30 bg-orange-50/20 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
            {event.posterUrl ? (
              <img src={event.posterUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                <span className="text-xs">No Poster</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-extrabold text-slate-900 truncate leading-tight mb-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-orange-600 border-orange-100 bg-white border px-2 py-0.5 rounded-lg">
                ID #{event.id}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${getStatusStyles(event.status)}`}>
                {event.status}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          <OnePageCreateEventForm
            initialData={event as any}
            isModal={true}
            onClose={() => {
              onClose();
              if (onSuccess) {
                onSuccess();
              } else {
                window.location.reload();
              }
            }}
          />
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
