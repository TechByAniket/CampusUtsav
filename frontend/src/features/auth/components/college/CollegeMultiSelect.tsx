import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface CollegeMultiSelectProps {
  label: string;
  options: { id: number; name: string; shortForm: string }[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

export const CollegeMultiSelect: React.FC<CollegeMultiSelectProps> = ({
  label,
  options,
  selectedIds,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onChange(selectedIds.filter((x) => x !== id));
  };

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[40px] py-1.5 px-3 flex flex-wrap gap-1.5 rounded-lg border cursor-pointer select-none bg-white transition-all ${
          error
            ? 'border-red-300 focus-within:ring-red-200 focus-within:border-red-400'
            : 'border-slate-200 focus-within:ring-orange-200 focus-within:border-orange-400'
        }`}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-sm text-slate-300 self-center">Select branches...</span>
        ) : (
          selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-orange-50 text-orange-700 rounded-md border border-orange-100"
            >
              {opt.shortForm}
              <button
                type="button"
                onClick={(e) => removeOption(e, opt.id)}
                className="hover:text-rose-500 text-orange-400 font-bold ml-0.5 focus:outline-none transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
      </div>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto z-[120] bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 no-scrollbar">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-xs text-slate-400 font-medium">No branches available</div>
            ) : (
              options.map((opt) => {
                const isSel = selectedIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`px-4 py-2 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                      isSel
                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-100/70'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>
                      {opt.name} ({opt.shortForm})
                    </span>
                    {isSel && <CheckCircle2 size={12} className="text-orange-500" />}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <div className="h-4 mt-1.5">
  {error && (
    <p className="text-[11px] leading-none text-red-500">
      {error}
    </p>
  )}
</div>
    </div>
  );
};
