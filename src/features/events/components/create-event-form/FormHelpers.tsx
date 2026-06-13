import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { type Attachment } from './types';

export const SectionHeader = ({ label }: { label: string }) => (
  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-3">
    <div className="w-2 h-2 bg-orange-500 rounded-full" /> {label}
  </h3>
);

export const CompactInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  min, 
  max, 
  icon, 
  placeholder 
}: { 
  label: string, 
  value: any, 
  onChange: (v: string) => void, 
  type?: string, 
  min?: any, 
  max?: any, 
  icon?: React.ReactNode, 
  placeholder?: string 
}) => (
  <div className="flex flex-col gap-1.5 w-full group">
    <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
      {icon} {label}
    </label>
    <div className="relative">
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[46px] px-4 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300"
      />
    </div>
  </div>
);

export const CompactTextarea = ({ 
  label, 
  value, 
  onChange, 
  icon, 
  placeholder, 
  rows = 4 
}: { 
  label: string, 
  value: string, 
  onChange: (v: string) => void, 
  icon?: React.ReactNode, 
  placeholder?: string, 
  rows?: number 
}) => (
  <div className="flex flex-col gap-1.5 w-full group">
    <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
      {icon} {label}
    </label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300 resize-none"
    />
  </div>
);

export const SelectionGroup = ({ 
  label, 
  items, 
  selected, 
  onToggle 
}: { 
  label: string, 
  items: { id: any, name: string }[], 
  selected: any[], 
  onToggle: (id: any) => void 
}) => (
  <div className="space-y-3">
    <SectionHeader label={label} />
    <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl max-h-48 overflow-y-auto no-scrollbar">
      {items.map(item => {
        const isSelected = selected.includes(Number(item.id));
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isSelected
                ? 'bg-orange-500 border-orange-600 text-white shadow-md shadow-orange-200/50'
                : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50/10'
            }`}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  </div>
);

export const AttachmentList = ({ 
  title, 
  icon, 
  rows, 
  onAdd, 
  onRemove, 
  onChange 
}: { 
  title: string, 
  icon: any, 
  rows: Attachment[], 
  onAdd: () => void, 
  onRemove: (i: number) => void, 
  onChange: (i: number, field: 'key' | 'value', v: string) => void 
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center px-1">
      <div className="flex items-center gap-2">
        <div className="text-orange-500">{icon}</div>
        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</h4>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-100 flex items-center justify-center"
      >
        <Plus size={14} />
      </button>
    </div>
    {rows.map((row, i) => (
      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-bottom-2 duration-200">
        <div className="relative group w-full">
          <input
            value={row.key}
            onChange={e => onChange(i, 'key', e.target.value)}
            placeholder="Title / Label"
            className="w-full h-[46px] px-4 bg-slate-50/80 border border-transparent rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300"
          />
        </div>
        <div className="flex gap-2">
          <input
            value={row.value}
            onChange={e => onChange(i, 'value', e.target.value)}
            placeholder="URL / Content Link"
            className="flex-1 h-[46px] px-4 bg-slate-50/80 border border-transparent rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300"
          />
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
);
