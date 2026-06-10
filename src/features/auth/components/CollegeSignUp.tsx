import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { registerCollege } from '@/services/collegeService';
import { getBranches } from '@/services/metaService';
import {
  ArrowLeft, ChevronLeft, ChevronRight,

  Eye, EyeOff, Upload, X, CheckCircle2
} from 'lucide-react';
import { CollegeBrandingSection } from './college/CollegeBrandingSection';

// ════════════════════════════════════════════════════════════
//  STEP CONFIG — 3 merged steps
// ════════════════════════════════════════════════════════════
const STEPS = ['College Details', 'Admin & Contact', 'Branding & Security'];

// ════════════════════════════════════════════════════════════
//  VALIDATION — same rules as before, grouped per step
// ════════════════════════════════════════════════════════════
const step1Schema = z.object({
  name:        z.string().min(10, 'Enter full college name'),
  shortForm:   z.string().min(3,  'At least 3 characters required'),
  affiliation: z.string().min(5,  'Affiliation status required'),
  address:     z.string().min(10, 'Enter full address'),
  city:        z.string().min(2,  'City name required'),
  district:    z.string().min(2,  'District name required'),
  state:       z.string().min(3,  'State name required'),
  branchIds:   z.array(z.number()).min(1, 'Select at least one branch'),
});

const step2Schema = z.object({
  adminName: z.string().min(5,  'Enter admin full name'),
  email:     z.string().email(  'Enter a valid email address'),
  phone:     z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  officialDomains: z.string().min(1, 'Enter official email domain(s)'),
});

const step3Schema = z.object({
  websiteUrl:   z.string().url('Enter a valid website URL').optional().or(z.literal('')),
  instagramUrl: z.string().url('Enter a valid Instagram URL').optional().or(z.literal('')),
  linkedInUrl:  z.string().url('Enter a valid LinkedIn URL').optional().or(z.literal('')),
  password:     z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

const stepSchemas = [step1Schema, step2Schema, step3Schema];

const stepFieldKeys: string[][] = [
  ['name', 'shortForm', 'affiliation', 'address', 'city', 'district', 'state', 'branchIds'],
  ['adminName', 'email', 'phone', 'officialDomains'],
  ['websiteUrl', 'instagramUrl', 'linkedInUrl', 'password'],
];

// ════════════════════════════════════════════════════════════
//  REUSABLE INLINE COMPONENTS
// ════════════════════════════════════════════════════════════

/** Simple themed text input */
const Input: React.FC<{
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; placeholder?: string; type?: string;
  half?: boolean; suffix?: React.ReactNode;
}> = ({ label, name, value, onChange, error, placeholder, type = 'text', half, suffix }) => (
  <div className={half ? 'flex-1 min-w-0' : ''}>
    <label htmlFor={name} className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
    <div className="relative">
      <input
        id={name} name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete="off"
        className={`w-full h-10 px-3 ${suffix ? 'pr-9' : ''} text-sm rounded-lg border ${
          error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-orange-200'
        } focus:outline-none focus:ring-2 transition-all bg-white placeholder:text-slate-300`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>
      )}
    </div>
    {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
  </div>
);

/** Styled file‑upload zone */
const FileUpload: React.FC<{
  label: string; name: string; file: File | null;
  onChange: (file: File | null) => void; error?: string;
}> = ({ label, name, file, onChange, error }) => (
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
      id={name} type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
      className="hidden"
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
    />
    {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
  </div>
);

/** Beautiful modern multi-select component */
const MultiSelect: React.FC<{
  label: string;
  options: { id: number; name: string; shortForm: string }[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}> = ({ label, options, selectedIds, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onChange(selectedIds.filter(x => x !== id));
  };

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full min-h-[40px] py-1.5 px-3 flex flex-wrap gap-1.5 rounded-lg border cursor-pointer select-none bg-white transition-all ${
          error
            ? 'border-red-300 focus-within:ring-red-200 focus-within:border-red-400'
            : 'border-slate-200 focus-within:ring-orange-200 focus-within:border-orange-400'
        }`}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-sm text-slate-300 self-center">Select branches...</span>
        ) : (
          selectedOptions.map(opt => (
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
              options.map(opt => {
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
                    <span>{opt.name} ({opt.shortForm})</span>
                    {isSel && <CheckCircle2 size={12} className="text-orange-500" />}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
      
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════

interface CollegeSignUpProps {
  onClose?: () => void;
}

export const CollegeSignUp: React.FC<CollegeSignUpProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState<{ id: number; name: string; shortForm: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const branchesData = await getBranches();
        setBranches(branchesData || []);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load branches');
      }
    })();
  }, []);

  // ── Text fields ──
  const [formData, setFormData] = useState({
    name: '', shortForm: '', affiliation: '',
    address: '', city: '', district: '', state: '',
    branchIds: [] as number[],
    adminName: '', email: '', phone: '',
    officialDomains: '',
    websiteUrl: '', instagramUrl: '', linkedInUrl: '',
    password: '',
  });

  // ── File fields ──
  const [files, setFiles] = useState<{ logo: File | null; collegeImg: File | null }>({
    logo: null, collegeImg: null,
  });

  // ────────────────────────────────────────────
  //  HANDLERS
  // ────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleFile = (field: 'logo' | 'collegeImg', file: File | null) => {
    if (file) {
      const ok = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!ok.includes(file.type))    { toast.error('Only PNG, JPG, JPEG or WEBP allowed'); return; }
      if (file.size > 2 * 1024 * 1024) { toast.error('File must be less than 2 MB');         return; }
    }
    setFiles(prev => ({ ...prev, [field]: file }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  // ────────────────────────────────────────────
  //  VALIDATION
  // ────────────────────────────────────────────
  const validateStep = (): boolean => {
    const schema = stepSchemas[currentStep];
    const keys   = stepFieldKeys[currentStep];
    const data: Record<string, any> = {};
    keys.forEach(k => { data[k] = (formData as any)[k]; });

    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(e => { if (!errs[e.path[0] as string]) errs[e.path[0] as string] = e.message; });
      setErrors(errs);
      return false;
    }

    // Step 3: file validation
    if (currentStep === 2) {
      const fileErr: Record<string, string> = {};
      if (!files.logo)       fileErr.logo       = 'Please upload a college logo';
      if (!files.collegeImg) fileErr.collegeImg  = 'Please upload a college image';
      if (Object.keys(fileErr).length) { setErrors(prev => ({ ...prev, ...fileErr })); return false; }
    }

    setErrors({});
    return true;
  };

  // ────────────────────────────────────────────
  //  NAVIGATION & SUBMIT
  // ────────────────────────────────────────────
  const goNext = () => { if (validateStep()) setCurrentStep(s => s + 1); };
  const goPrev = () => { setErrors({}); setCurrentStep(s => s - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (isLoading) return;

    setIsLoading(true);
    try {
      const finalData = { ...formData, logo: files.logo, collegeImg: files.collegeImg };
      await registerCollege(finalData);
      setIsSubmitted(true);
      toast.success('College Registered Successfully!');
      setTimeout(() => {
        if (onClose) onClose();
        navigate('/auth/sign-in');
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || 'College registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ────────────────────────────────────────────
  //  DERIVED
  // ────────────────────────────────────────────
  const isLastStep  = currentStep === STEPS.length - 1;


  const percentage  = Math.round(((currentStep + 1) / STEPS.length) * 100);

  // ════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#fffaf5] via-[#fff3e8] to-[#ffedd5] overflow-y-auto no-scrollbar selection:bg-orange-100 selection:text-orange-900 text-slate-900">
      <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 md:p-8">

        {/* ── OUTER CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="my-auto w-full max-w-[1100px] bg-white rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(234,88,12,0.12)] grid grid-cols-1 lg:grid-cols-[42%_58%] overflow-hidden border border-orange-100/40 relative"
        >

          {/* ════ LEFT COLUMN ════ */}
          <CollegeBrandingSection />

          {/* ════ RIGHT COLUMN ════ */}
          <div className="flex flex-col justify-center px-6 py-5 md:px-8 md:py-6 overflow-y-auto max-h-[95vh] lg:max-h-none">

            {/* Back to roles */}
            <button
              onClick={onClose} type="button"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3 w-fit transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to roles
            </button>

            {/* Mobile brand */}
            <div className="lg:hidden mb-4">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Campus<span className="text-orange-500">Utsav</span>
              </h1>
            </div>

            {/* Heading */}
            <div className="mb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">College Registration</h2>
              <p className="text-sm text-slate-500 mt-0.5">Register your institution on the platform</p>
            </div>

            {/* ── PROGRESS BAR ── */}
            <div className="mb-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Step {currentStep + 1} of {STEPS.length}</span>
                <span>{percentage}%</span>
              </div>
              <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* ── STEP TITLE ── */}
            <h3 className="text-base font-bold text-slate-800 mb-4">{STEPS[currentStep]}</h3>

            {/* ── STEP FIELDS ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 min-h-0 space-y-3"
              >
                {/* ───── STEP 1: College Details ───── */}
                {currentStep === 0 && (
                  <>
                    <Input label="College Name" name="name" value={formData.name}
                      onChange={handleChange} error={errors.name} placeholder="Enter full college name" />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input label="Short Form" name="shortForm" value={formData.shortForm}
                        onChange={handleChange} error={errors.shortForm} placeholder="Eg. MIT" half />
                      <Input label="Affiliation" name="affiliation" value={formData.affiliation}
                        onChange={handleChange} error={errors.affiliation} placeholder="University / Board" half />
                    </div>

                    <Input label="Address" name="address" value={formData.address}
                      onChange={handleChange} error={errors.address} placeholder="Eg. 123 Main St" />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input label="City" name="city" value={formData.city}
                        onChange={handleChange} error={errors.city} placeholder="Eg. Navi Mumbai" half />
                      <Input label="District" name="district" value={formData.district}
                        onChange={handleChange} error={errors.district} placeholder="Eg. Thane" half />
                    </div>

                    <Input label="State" name="state" value={formData.state}
                      onChange={handleChange} error={errors.state} placeholder="Eg. Maharashtra" />

                    <MultiSelect
                      label="Official College Branches"
                      options={branches}
                      selectedIds={formData.branchIds}
                      onChange={(ids) => {
                        setFormData(prev => ({ ...prev, branchIds: ids }));
                        if (errors.branchIds) {
                          setErrors(prev => { const n = { ...prev }; delete n.branchIds; return n; });
                        }
                      }}
                      error={errors.branchIds}
                    />
                  </>
                )}

                {/* ───── STEP 2: Admin & Contact ───── */}
                {currentStep === 1 && (
                  <>
                    <Input label="Admin Full Name" name="adminName" value={formData.adminName}
                      onChange={handleChange} error={errors.adminName} placeholder="Enter full admin name" />
                    <Input label="Email Address" name="email" value={formData.email} type="email"
                      onChange={handleChange} error={errors.email} placeholder="admin@college.edu" />
                    <Input label="Phone Number" name="phone" value={formData.phone}
                      onChange={handleChange} error={errors.phone} placeholder="9876543210" />
                    <Input label="Official Email Domains" name="officialDomains" value={formData.officialDomains}
                      onChange={handleChange} error={errors.officialDomains} placeholder="Eg. @college.edu, @engg.college.edu" />
                  </>
                )}

                {/* ───── STEP 3: Branding & Security ───── */}
                {currentStep === 2 && (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <FileUpload label="College Logo" name="college-logo"
                        file={files.logo} onChange={(f) => handleFile('logo', f)} error={errors.logo} />
                      <FileUpload label="College Image" name="college-img"
                        file={files.collegeImg} onChange={(f) => handleFile('collegeImg', f)} error={errors.collegeImg} />
                    </div>

                    <Input label="Website URL" name="websiteUrl" value={formData.websiteUrl}
                      onChange={handleChange} error={errors.websiteUrl} placeholder="https://www.college.edu" />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input label="Instagram URL" name="instagramUrl" value={formData.instagramUrl}
                        onChange={handleChange} error={errors.instagramUrl} placeholder="https://instagram.com/..." half />
                      <Input label="LinkedIn URL" name="linkedInUrl" value={formData.linkedInUrl}
                        onChange={handleChange} error={errors.linkedInUrl} placeholder="https://linkedin.com/..." half />
                    </div>

                    {/* Password with visibility toggle */}
                    <div>
                      <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Create Password
                      </label>
                      <div className="relative">
                        <input
                          id="password" name="password" value={formData.password}
                          type={showPassword ? 'text' : 'password'}
                          onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                          className={`w-full h-10 px-3 pr-9 text-sm rounded-lg border ${
                            errors.password ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-orange-200'
                          } focus:outline-none focus:ring-2 transition-all bg-white placeholder:text-slate-300`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}

                      {/* Password requirements */}
                      <div className="flex flex-col gap-0.5 mt-2 text-[11px] text-slate-400">
                        <span className={formData.password.length >= 8  ? 'text-emerald-500' : ''}>• At least 8 characters</span>
                        <span className={/[A-Z]/.test(formData.password) ? 'text-emerald-500' : ''}>• One uppercase letter</span>
                        <span className={/[0-9]/.test(formData.password) ? 'text-emerald-500' : ''}>• One number</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── NAVIGATION ── */}
            <div className="flex flex-row justify-between pt-4 mt-4 border-t border-slate-100">
              <button
                type="button" onClick={goPrev} disabled={currentStep === 0 || isLoading}
                className="flex items-center gap-1.5 h-[42px] px-5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <motion.button
                type="button"
                onClick={isLastStep ? handleSubmit : goNext}
                disabled={isLoading}
                whileHover={isLoading ? {} : { scale: 1.01 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                className="flex items-center gap-1.5 h-[42px] px-6 text-sm font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    {isLastStep ? 'Submit' : 'Next'} <ChevronRight size={16} />
                  </>
                )}
              </motion.button>
            </div>

            {/* Footer */}
            <p className="text-center sm:text-left text-sm text-slate-500 mt-4">
              Already registered?{' '}
              <a href="/auth/sign-in" className="text-orange-600 font-bold hover:underline hover:text-orange-700 transition-colors">
                Log in
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
