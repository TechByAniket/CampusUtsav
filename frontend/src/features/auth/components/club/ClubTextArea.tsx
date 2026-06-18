import React from 'react';

interface ClubTextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon: React.ReactNode;
  placeholder?: string;
}

export const ClubTextArea: React.FC<ClubTextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  icon,
  placeholder,
}) => (
  <div className="space-y-1 group w-full">
    <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
      {icon} {label}
    </label>
    <textarea
      id={`club-${name}`}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      className="w-full px-4 py-3 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300 resize-none no-scrollbar"
    />
  </div>
);
