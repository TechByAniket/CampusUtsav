import React, { useState } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';

interface StaffInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  placeholder?: string;
  half?: boolean;
  children?: React.ReactNode;
  infoTooltip?: string;
  suffix?: React.ReactNode;
}

export const StaffInput: React.FC<StaffInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  icon,
  placeholder,
  half = false,
  children,
  infoTooltip,
  suffix
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`space-y-1 group ${half ? 'flex-1 min-w-0' : 'w-full'}`}>
      <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5 group-focus-within:text-orange-500 transition-colors relative">
        {icon} {label}
        {infoTooltip && (
          <span className="relative group/tooltip inline-block cursor-help text-slate-400 hover:text-slate-600 ml-1">
            <Info size={12} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tooltip:block w-48 p-2 bg-slate-800 text-[10px] font-medium text-white rounded-lg shadow-lg z-50 text-center leading-normal normal-case pointer-events-none">
              {infoTooltip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        <input
          id={`staff-${name}`}
          name={name}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-[46px] px-4 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-900 outline-none border border-transparent focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all placeholder:text-slate-300 ${suffix || isPassword ? 'pr-10' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {!isPassword && suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
