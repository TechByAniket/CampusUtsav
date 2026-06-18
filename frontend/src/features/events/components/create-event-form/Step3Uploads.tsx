import React from 'react';
import { Globe, Lock, Plus, Phone, User, Mail, Trash2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { AttachmentList } from './FormHelpers';
import { type FormDataState } from './types';
import type { AdminEventDetail } from '@/types/event';

interface Step3UploadsProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  initialData?: AdminEventDetail | null;
  setStep: (s: number) => void;
}

export const Step3Uploads: React.FC<Step3UploadsProps> = ({
  formData,
  setFormData,
  initialData,
  setStep
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-6">
      <div className="space-y-6">
        <AttachmentList 
          title="Public Documentation" 
          icon={<Globe size={16}/>} 
          rows={formData.publicAttachments} 
          onAdd={() => setFormData(p => ({
            ...p, 
            publicAttachments: [...p.publicAttachments, { key: '', value: '' }]
          }))} 
          onRemove={i => setFormData(p => ({
            ...p, 
            publicAttachments: p.publicAttachments.filter((_, idx) => idx !== i)
          }))} 
          onChange={(i, f, v) => {
            const updated = [...formData.publicAttachments];
            updated[i][f] = v;
            setFormData({ ...formData, publicAttachments: updated });
          }} 
        />
        <AttachmentList 
          title="Private Attachments" 
          icon={<Lock size={16}/>} 
          rows={formData.privateAttachments} 
          onAdd={() => setFormData(p => ({
            ...p, 
            privateAttachments: [...p.privateAttachments, { key: '', value: '' }]
          }))} 
          onRemove={i => setFormData(p => ({
            ...p, 
            privateAttachments: p.privateAttachments.filter((_, idx) => idx !== i)
          }))} 
          onChange={(i, f, v) => {
            const updated = [...formData.privateAttachments];
            updated[i][f] = v;
            setFormData({ ...formData, privateAttachments: updated });
          }} 
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Phone className="text-orange-500" size={16}/>
              <h4 className="text-[11px] font-semibold text-slate-500 tracking-wider">Contact Details</h4>
            </div>
            <button 
              type="button" 
              onClick={() => setFormData(p => ({
                ...p, 
                contactDetails: [...p.contactDetails, { name: '', phone: '', email: '' }]
              }))} 
              className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-100 flex items-center justify-center"
            >
              <Plus size={14}/>
            </button>
          </div>
          {formData.contactDetails.map((contact, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in slide-in-from-bottom-2 duration-200 items-end">
              <div className="relative group w-full">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={14}/>
                <input 
                  value={contact.name} 
                  onChange={e => { 
                    const updated = [...formData.contactDetails]; 
                    updated[i].name = e.target.value; 
                    setFormData({ ...formData, contactDetails: updated });
                  }} 
                  placeholder="Full Name" 
                  className="w-full h-[46px] pl-10 pr-4 bg-slate-50/80 border border-transparent rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300" 
                />
              </div>
              <div className="relative group w-full">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={14}/>
                <input 
                  value={contact.phone} 
                  onChange={e => { 
                    const updated = [...formData.contactDetails]; 
                    updated[i].phone = e.target.value; 
                    setFormData({ ...formData, contactDetails: updated });
                  }} 
                  placeholder="Phone" 
                  className="w-full h-[46px] pl-10 pr-4 bg-slate-50/80 border border-transparent rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300" 
                />
              </div>
              <div className="relative group flex gap-2 items-center w-full">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={14}/>
                  <input 
                    value={contact.email} 
                    onChange={e => { 
                      const updated = [...formData.contactDetails]; 
                      updated[i].email = e.target.value; 
                      setFormData({ ...formData, contactDetails: updated });
                    }} 
                    placeholder="Email" 
                    className="w-full h-[46px] pl-10 pr-4 bg-slate-50/80 border border-transparent rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300" 
                  />
                </div>
                {formData.contactDetails.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setFormData(p => ({
                      ...p, 
                      contactDetails: p.contactDetails.filter((_, idx) => idx !== i)
                    }))} 
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Trash2 size={16}/>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <div className="space-y-1">
          <h4 className="text-[11px] font-semibold text-slate-500 ml-0.5">Event Poster</h4>
          <p className="text-[10px] font-medium text-slate-400 italic">Max size: 5MB.</p>
          {initialData && !formData.poster && <p className="text-[10px] text-orange-600 font-semibold mt-1">Using Existing Poster</p>}
        </div>
        <label className="relative h-44 bg-white border-2 border-dashed border-orange-200/60 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-all overflow-hidden group">
          {formData.poster ? (
            <img src={URL.createObjectURL(formData.poster)} className="w-full h-full object-cover" />
          ) : initialData ? (
            <img src={initialData.posterUrl} className="w-full h-full object-cover opacity-50" />
          ) : (
            <Upload size={24} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={e => setFormData({
              ...formData, 
              poster: e.target.files ? e.target.files[0] : null
            })} 
          />
        </label>
      </div>

      <div className="flex justify-between items-center gap-4 pt-4">
        <motion.button 
          type="button" 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(2)} 
          className="w-32 h-[46px] border border-orange-200 text-orange-600 hover:bg-orange-50/50 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shrink-0"
        >
          Back
        </motion.button>
        <motion.button 
          type="submit" 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={!!((formData.teamEvent && formData.minTeamSize > formData.maxTeamSize) || (formData.startDate && formData.endDate && formData.startDate > formData.endDate))} 
          className="w-44 h-[46px] bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
        >
          Submit
        </motion.button>
      </div>
    </div>
  );
};
