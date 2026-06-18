import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Edit3 as Edit3Icon } from 'lucide-react';
import { getEventApprovalHistory } from '@/services/eventService';
import { ApprovalChain } from './ApprovalChain';

import type { EventSummary } from '@/types/event';
import type { ApprovalLog } from '@/types/approval';

interface SubmissionModalProps {
  event: EventSummary;
  onClose: () => void;
  onEdit: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ event, onClose, onEdit }) => {
  const [history, setHistory] = useState<ApprovalLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getEventApprovalHistory(event.id);
        setHistory(data || []);
        if (data && data.length > 0) {
          const maxVersion = Math.max(...data.map((h: ApprovalLog) => h.version));
          setSelectedVersion(maxVersion);
        }
      } catch (err) { 
        console.error(err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchHistory();
  }, [event.id]);

  const versions = useMemo(() => {
    const vMap: Record<number, any[]> = {};
    history.forEach(h => {
      if (!vMap[h.version]) vMap[h.version] = [];
      vMap[h.version].push(h);
    });
    return vMap;
  }, [history]);

  const sortedVersions = Object.keys(versions).map(Number).sort((a, b) => b - a);
  const currentHistory = selectedVersion ? versions[selectedVersion] : [];

  const isReverted = event.status === 'REVERTED';
  const isApproved = event.status === 'APPROVED';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-scrollbar font-sans">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(234,88,12,0.12)] border border-orange-100/40 relative overflow-hidden my-auto"
      >
        {/* Premium Header */}
        <div className="px-6 py-4 border-b border-orange-100/30 bg-orange-50/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
            {event.posterUrl ? (
              <img src={event.posterUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                <span className="text-xs">No Poster</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 truncate leading-tight mb-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-orange-600 border-orange-100 bg-white border px-2.5 py-0.5 rounded-lg">
                ID #{event.id}
              </span>
              <span 
                className={`text-[12px] font-black px-2.5 py-0.5 rounded border ${
                  isApproved 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : isReverted 
                    ? 'bg-orange-50 text-orange-600 border-orange-100' 
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
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

        <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Version Selector */}
          {!isLoading && sortedVersions.length > 1 && (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {sortedVersions.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVersion(v)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-black tracking-widest transition-all ${
                    selectedVersion === v 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-100/50' 
                      : 'bg-slate-50 text-slate-400 hover:bg-orange-50/20'
                  }`}
                >
                  v{v}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="py-16 text-center flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[12px] font-black text-slate-400 tracking-widest">Fetching logs...</p>
            </div>
          ) : (
            <ApprovalChain
              history={currentHistory}
              isFinalApproved={isApproved && selectedVersion === Math.max(...sortedVersions)}
              currentStatus={event.status}
            />
          )}

          <div className="mt-5 flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose} 
              className="flex-1 h-[46px] border border-orange-200 text-orange-600 hover:bg-orange-50/50 rounded-xl text-sm font-bold tracking-wider transition-all flex items-center justify-center shrink-0"
            >
              Dismiss
            </motion.button>
            {isReverted && selectedVersion === Math.max(...sortedVersions) && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEdit}
                className="flex-2 h-[46px] bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all flex items-center justify-center gap-2 shrink-0 px-6"
              >
                <Edit3Icon size={14} /> Resubmit
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
