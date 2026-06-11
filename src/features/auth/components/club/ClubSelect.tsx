import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ClubSelectProps {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: string | number; name: string }[];
  placeholder: string;
  half?: boolean;
  isOptional?: boolean;
}

export const ClubSelect: React.FC<ClubSelectProps> = ({
  label,
  icon,
  name,
  value,
  onChange,
  options,
  placeholder,
  half = false,
  isOptional = false,
}) => (
  <div className={`space-y-1 group ${half ? 'flex-1 min-w-0' : 'w-full'}`}>
    <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
      {icon} {label}
      {isOptional && <span className="text-[10px] font-normal text-slate-400">(Optional)</span>}
    </label>
    <div className="relative">
      <select
        id={`club-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-[46px] px-4 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all appearance-none"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);
