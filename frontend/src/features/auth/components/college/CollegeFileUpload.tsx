import React from 'react';
import { CheckCircle2, Upload, X } from 'lucide-react';

interface CollegeFileUploadProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const CollegeFileUpload: React.FC<CollegeFileUploadProps> = ({
  label,
  name,
  file,
  onChange,
  error,
}) => (
  <div className="flex-1 min-w-0">
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
    <label
      htmlFor={name}
      className={`flex items-center gap-2.5 h-10 px-3 rounded-lg border border-dashed cursor-pointer transition-all ${
        error
          ? 'border-red-300 bg-red-50/40'
          : file
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-slate-200 bg-slate-50/40 hover:border-orange-300 hover:bg-orange-50/20'
      }`}
    >
      {file ? (
        <>
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
          <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onChange(null); }}
            className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <Upload size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-400">Choose file…</span>
        </>
      )}
    </label>
    <input
      id={name}
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      className="hidden"
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
    />
    <div className="h-4 mt-1.5">
  {error && (
    <p className="text-[11px] leading-none text-red-500">
      {error}
    </p>
  )}
</div>
  </div>
);
