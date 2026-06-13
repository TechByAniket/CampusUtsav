import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { OnePageCreateEventForm } from '@/features/events/components/CreateEventForm';

import type { Event } from '@/types/event';

interface ResubmitModalProps {
  event: Event;
  onClose: () => void;
}

export const ResubmitModal: React.FC<ResubmitModalProps> = ({ event, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto no-scrollbar">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(234,88,12,0.12)] border border-orange-100/40 relative overflow-hidden my-auto"
      >
        <div className="p-6 border-b border-orange-100/30 flex items-center justify-between bg-orange-50/20">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Resubmit Proposal • #{event.id}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"><X size={20} /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <OnePageCreateEventForm
            initialData={event as any}
            isModal={true}
            onClose={() => {
              onClose();
              window.location.reload();
            }}
          />
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
