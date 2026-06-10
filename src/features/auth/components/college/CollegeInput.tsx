import React from 'react';

interface CollegeInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  half?: boolean;
  suffix?: React.ReactNode;
}

export const CollegeInput: React.FC<CollegeInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  half,
  suffix,
}) => (
  <div className={half ? "flex-1 min-w-0" : ""}>
  <label
    htmlFor={name}
    className="block text-xs font-semibold text-slate-600 mb-1"
  >
    {label}
  </label>

  <div className="relative">
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      className={`w-full h-10 px-3 ${
        suffix ? "pr-9" : ""
      } text-sm rounded-lg border ${
        error
          ? "border-red-300 focus:ring-red-200"
          : "border-slate-200 focus:ring-orange-200"
      } focus:outline-none focus:ring-2 transition-all bg-white placeholder:text-slate-300`}
    />

    {suffix && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        {suffix}
      </span>
    )}
  </div>

  <div className="h-4 mt-1.5">
    {error && (
      <p className="text-[11px] leading-none text-red-500">
        {error}
      </p>
    )}
  </div>
</div>
);
