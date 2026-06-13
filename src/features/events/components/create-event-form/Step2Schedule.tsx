import React from 'react';
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import { CompactInput, SelectionGroup } from './FormHelpers';
import { type FormDataState } from './types';

interface Step2ScheduleProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  todayString: string;
  collegeBranches: Record<string, string>;
  years: { id: number; name: string }[];
  toggleSelection: (field: 'allowed_branches' | 'allowed_years', id: string | number) => void;
  validateStep2: () => boolean;
  setStep: (s: number) => void;
}

export const Step2Schedule: React.FC<Step2ScheduleProps> = ({
  formData,
  setFormData,
  todayString,
  collegeBranches,
  years,
  toggleSelection,
  validateStep2,
  setStep
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
          <CompactInput 
            label="Start Date *" 
            type="date" 
            min={todayString} 
            value={formData.startDate} 
            onChange={v => setFormData({ ...formData, startDate: v })} 
            icon={<Calendar size={14} />} 
          />
          <CompactInput 
            label="End Date *" 
            type="date" 
            min={formData.startDate || todayString} 
            value={formData.endDate} 
            onChange={v => setFormData({ ...formData, endDate: v })} 
            icon={<Calendar size={14} />} 
          />
          <CompactInput 
            label="Start Time *" 
            type="time" 
            value={formData.startTime} 
            onChange={v => setFormData({ ...formData, startTime: v })} 
            icon={<Clock size={14} />} 
          />
          <CompactInput 
            label="End Time *" 
            type="time" 
            value={formData.endTime} 
            onChange={v => setFormData({ ...formData, endTime: v })} 
            icon={<Clock size={14} />} 
          />
          <div className="sm:col-span-2">
            <CompactInput 
              label="Deadline *" 
              type="date" 
              min={todayString} 
              max={formData.startDate || ''} 
              value={formData.registrationDeadline} 
              onChange={v => setFormData({ ...formData, registrationDeadline: v })} 
              icon={<Calendar size={14} />} 
            />
          </div>
        </div>
        {formData.startDate && formData.endDate && formData.startDate > formData.endDate && (
          <p className="text-rose-500 text-[10px] font-semibold uppercase mt-1">
            End date cannot be before start date
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SelectionGroup 
          label="Allowed Branches" 
          items={Object.entries(collegeBranches).map(([id, name]) => ({ id, name }))} 
          selected={formData.allowed_branches} 
          onToggle={id => toggleSelection('allowed_branches', id)} 
        />
        <SelectionGroup 
          label="Allowed Years" 
          items={years} 
          selected={formData.allowed_years} 
          onToggle={id => toggleSelection('allowed_years', id)} 
        />
      </div>

      <div className="flex flex-col gap-4 p-5 border border-orange-100 bg-orange-50/10 rounded-2xl transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
               <Users size={14} />
             </div>
             <div>
                <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Team Event</h4>
             </div>
          </div>
          <label className="relative flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={formData.teamEvent} 
              onChange={e => setFormData({ ...formData, teamEvent: e.target.checked })} 
              className="sr-only peer" 
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500 peer-focus:ring-orange-400"></div>
          </label>
        </div>

        {formData.teamEvent && (
          <div className="pt-4 border-t border-orange-100/30 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 ml-1 mb-1 block">Min Team Size *</label>
                <input 
                  type="number" 
                  min={1} 
                  value={formData.minTeamSize} 
                  onChange={e => setFormData({ ...formData, minTeamSize: Number(e.target.value) })} 
                  className="w-full h-[40px] px-3 bg-white border border-slate-200 focus:border-orange-400 rounded-xl text-center font-semibold text-sm outline-none focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all" 
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 ml-1 mb-1 block">Max Team Size *</label>
                <input 
                  type="number" 
                  min={1} 
                  value={formData.maxTeamSize} 
                  onChange={e => setFormData({ ...formData, maxTeamSize: Number(e.target.value) })} 
                  className="w-full h-[40px] px-3 bg-white border border-slate-200 focus:border-orange-400 rounded-xl text-center font-semibold text-sm outline-none focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all" 
                />
              </div>
            </div>
            {formData.minTeamSize > formData.maxTeamSize && (
              <p className="text-rose-500 text-[10px] font-semibold uppercase mt-1.5 ml-1">
                Minimum team size cannot be greater than maximum team size
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-4 pt-4">
        <button 
          type="button" 
          onClick={() => setStep(1)} 
          className="w-32 h-[46px] border border-orange-200 text-orange-600 hover:bg-orange-50/50 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shrink-0"
        >
          Back
        </button>
        <button 
          type="button" 
          disabled={!!((formData.teamEvent && formData.minTeamSize > formData.maxTeamSize) || (formData.startDate && formData.endDate && formData.startDate > formData.endDate))}
          onClick={() => validateStep2() && setStep(3)} 
          className="w-44 h-[46px] bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
        >
          Continue <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  );
};
