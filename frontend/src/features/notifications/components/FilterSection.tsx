import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const FilterSection = ({
  title,
  options,
  selected,
  onSelect,
  icon: Icon,
  colorClass,
}: {
  title: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (val: string) => void;
  icon: any;
  colorClass: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selected !== "ALL";

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 hover:bg-slate-50 transition-colors px-2 rounded-lg group"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className={colorClass} />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700">{title}</h3>
          {isSelected && (
            <span className="w-5 h-5 flex items-center justify-center bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">
              1
            </span>
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2 pb-4 px-2">
              {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all group">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${selected === opt.value ? 'bg-orange-600 border-orange-600' : 'border-slate-300 group-hover:border-orange-400'}`}>
                    {selected === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <input
                    type="radio"
                    name={title}
                    className="hidden"
                    checked={selected === opt.value}
                    onChange={() => onSelect(opt.value)}
                  />
                  <span className="text-[11px] font-bold text-slate-700 truncate">{opt.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
