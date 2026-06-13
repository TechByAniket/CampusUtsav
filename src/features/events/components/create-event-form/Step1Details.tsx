import React from 'react';
import { Sparkles, MapPin, Layers, ChevronDown, Tag, FileText, ChevronRight } from 'lucide-react';
import { CompactInput, CompactTextarea } from './FormHelpers';
import { type FormDataState } from './types';

interface Step1DetailsProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  metaData: Record<string, string[]>;
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  validateStep1: () => boolean;
  setStep: (s: number) => void;
}

export const Step1Details: React.FC<Step1DetailsProps> = ({
  formData,
  setFormData,
  metaData,
  handleCategoryChange,
  validateStep1,
  setStep
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CompactInput 
            label="Title *" 
            value={formData.title} 
            onChange={v => setFormData({ ...formData, title: v })} 
            icon={<Sparkles size={14} />} 
            placeholder="e.g. Code Clash Hackathon" 
          />
          <CompactInput 
            label="Venue *" 
            value={formData.venue} 
            onChange={v => setFormData({ ...formData, venue: v })} 
            icon={<MapPin size={14} />} 
            placeholder="e.g. Seminar Hall A" 
          />
          
          <div className="flex flex-col gap-1.5 w-full group">
            <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
              <Layers size={14} /> Event Category *
            </label>
            <div className="relative">
              <select 
                value={formData.eventCategory} 
                onChange={handleCategoryChange} 
                className="w-full h-[46px] px-4 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all appearance-none"
              >
                {Object.keys(metaData).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full group">
            <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
              <Tag size={14} /> Event Sub-Type *
            </label>
            <div className="relative">
              <select 
                value={formData.eventType} 
                onChange={e => setFormData({ ...formData, eventType: e.target.value })} 
                className="w-full h-[46px] px-4 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all appearance-none"
              >
                {(metaData[formData.eventCategory] || []).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <CompactInput 
            label="Registration Fees (₹) *" 
            type="number" 
            value={formData.fees} 
            onChange={v => setFormData({ ...formData, fees: Number(v) })} 
            icon={<Tag size={14} />} 
            placeholder="0 for Free Event" 
          />
          <div className="hidden sm:block"></div>
        </div>
        
        <CompactTextarea 
          label="Description *" 
          value={formData.description} 
          onChange={v => setFormData({ ...formData, description: v })} 
          icon={<FileText size={14} />} 
          placeholder="Describe your event guidelines, schedule, and details..." 
        />
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="button" 
          onClick={() => validateStep1() && setStep(2)} 
          className="w-44 h-[46px] bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
        >
          Continue <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  );
};
