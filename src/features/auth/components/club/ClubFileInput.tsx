import React from 'react';
import { Camera } from 'lucide-react';

interface ClubFileInputProps {
  label: string;
  icon: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export const ClubFileInput: React.FC<ClubFileInputProps> = ({
  label,
  icon,
  onChange,
  preview,
}) => (
  <div className="space-y-1 group w-full">
    <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors">
      {icon} {label}
    </label>
    <div className="relative group/file">
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className={`w-full h-[80px] border-2 border-dashed rounded-xl flex items-center justify-center gap-4 transition-all group-hover/file:border-orange-400/50 group-hover/file:bg-orange-50/30 ${preview ? 'border-orange-300 bg-orange-50/20' : 'border-slate-200 bg-slate-50/80'}`}>
        {preview ? (
          <div className="flex items-center gap-4 px-4 w-full">
            <img src={preview} alt="Logo Preview" className="w-12 h-12 rounded-lg object-cover shadow-sm border border-white" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">Logo Selected</p>
              <p className="text-[10px] text-slate-400 font-medium">Click to replace image</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Camera size={20} className="text-slate-300 group-hover/file:text-orange-400 transition-colors mb-1" />
            <p className="text-[10px] font-bold text-slate-400">Upload Club Logo</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
