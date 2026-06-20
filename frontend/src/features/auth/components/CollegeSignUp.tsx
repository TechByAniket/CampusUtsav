import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { registerCollege } from '@/services/collegeService';
import { getBranches } from '@/services/metaService';
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  Eye, EyeOff
} from 'lucide-react';
import { CollegeBrandingSection } from './college/CollegeBrandingSection';
import { CollegeInput } from './college/CollegeInput';
import { CollegeFileUpload } from './college/CollegeFileUpload';
import { CollegeMultiSelect } from './college/CollegeMultiSelect';

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
  const [agreedTerms, setAgreedTerms] = useState(false);
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
          className="my-auto w-full max-w-[1100px] bg-white rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(234,88,12,0.12)] grid grid-cols-1 lg:grid-cols-[42%_58%] overflow-hidden border border-orange-100/40 relative h-[90vh] lg:h-[720px]"
        >

          {/* ════ LEFT COLUMN ════ */}
          <CollegeBrandingSection />

          {/* ════ RIGHT COLUMN ════ */}
          <div className="flex flex-col h-full px-6 py-5 md:px-8 md:py-6 overflow-hidden">

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
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
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
                  <CollegeDetailsStep
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    setErrors={setErrors}
                    setFormData={setFormData}
                    branches={branches}
                  />
                )}

                {/* ───── STEP 2: Admin & Contact ───── */}
                {currentStep === 1 && (
                  <AdminContactStep
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    setErrors={setErrors}
                    setFormData={setFormData}
                  />
                )}

                {/* ───── STEP 3: Branding & Security ───── */}
                {currentStep === 2 && (
                  <BrandingSecurityStep
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    setErrors={setErrors}
                    setFormData={setFormData}
                    files={files}
                    handleFile={handleFile}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                )}
              </motion.div>
              </AnimatePresence>

              {currentStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 mt-4 pt-4 border-t border-slate-100"
                >
                  <input
                    id="college-agree-terms"
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 accent-orange-500 cursor-pointer"
                  />
                  <label htmlFor="college-agree-terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline cursor-pointer">Terms & Conditions</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline cursor-pointer">Privacy Policy</a>
                  </label>
                </motion.div>
              )}
            </div>

            {/* ── NAVIGATION ── */}
            <div className="flex flex-row justify-between pt-4 mt-auto border-t border-slate-100 shrink-0">
              <button
                type="button" onClick={goPrev} disabled={currentStep === 0 || isLoading}
                className="flex items-center gap-1.5 h-[42px] px-5 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-slate-200"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <motion.button
                type="button"
                onClick={isLastStep ? handleSubmit : goNext}
                whileHover={isLoading ? {} : { scale: 1.01 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                className={`flex items-center justify-center gap-1.5 h-[42px] px-6 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLastStep 
                    ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 w-full sm:w-auto px-10' 
                    : 'bg-slate-900 hover:bg-black shadow-lg shadow-slate-100'
                }`}
                disabled={isLoading || (isLastStep && !agreedTerms)}
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
            <p className="text-center sm:text-left text-sm text-slate-500 mt-4 shrink-0">
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

// ════════════════════════════════════════════════════════════
//  STEP COMPONENTS
// ════════════════════════════════════════════════════════════

interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const CollegeDetailsStep: React.FC<StepProps & { branches: any[] }> = ({
  formData,
  handleChange,
  errors,
  setErrors,
  setFormData,
  branches,
}) => (
  <>
    <CollegeInput label="College Name" name="name" value={formData.name}
      onChange={handleChange} error={errors.name} placeholder="Enter full college name" />

    <div className="flex flex-col sm:flex-row gap-3">
      <CollegeInput label="Short Form" name="shortForm" value={formData.shortForm}
        onChange={handleChange} error={errors.shortForm} placeholder="Eg. MIT" half />
      <CollegeInput label="Affiliation" name="affiliation" value={formData.affiliation}
        onChange={handleChange} error={errors.affiliation} placeholder="University / Board" half />
    </div>

    <CollegeInput label="Address" name="address" value={formData.address}
      onChange={handleChange} error={errors.address} placeholder="Eg. 123 Main St" />

    <div className="flex flex-col sm:flex-row gap-3">
      <CollegeInput label="City" name="city" value={formData.city}
        onChange={handleChange} error={errors.city} placeholder="Eg. Navi Mumbai" half />
      <CollegeInput label="District" name="district" value={formData.district}
        onChange={handleChange} error={errors.district} placeholder="Eg. Thane" half />
    </div>

    <CollegeInput label="State" name="state" value={formData.state}
      onChange={handleChange} error={errors.state} placeholder="Eg. Maharashtra" />

    <CollegeMultiSelect
      label="Official College Branches"
      options={branches}
      selectedIds={formData.branchIds}
      onChange={(ids) => {
        setFormData((prev: any) => ({ ...prev, branchIds: ids }));
        if (errors.branchIds) {
          setErrors(prev => { const n = { ...prev }; delete n.branchIds; return n; });
        }
      }}
      error={errors.branchIds}
    />
  </>
);

const AdminContactStep: React.FC<StepProps> = ({
  formData,
  handleChange,
  errors,
}) => (
  <>
    <CollegeInput label="Admin Full Name" name="adminName" value={formData.adminName}
      onChange={handleChange} error={errors.adminName} placeholder="Enter full admin name" />
    <CollegeInput label="Email Address" name="email" value={formData.email} type="email"
      onChange={handleChange} error={errors.email} placeholder="admin@college.edu" />
    <CollegeInput label="Phone Number" name="phone" value={formData.phone}
      onChange={handleChange} error={errors.phone} placeholder="9876543210" />
    <CollegeInput label="Official Email Domains" name="officialDomains" value={formData.officialDomains}
      onChange={handleChange} error={errors.officialDomains} placeholder="Eg. @college.edu, @engg.college.edu" />
  </>
);

interface BrandingSecurityStepProps extends StepProps {
  files: { logo: File | null; collegeImg: File | null };
  handleFile: (field: 'logo' | 'collegeImg', file: File | null) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const BrandingSecurityStep: React.FC<BrandingSecurityStepProps> = ({
  formData,
  handleChange,
  errors,
  files,
  handleFile,
  showPassword,
  setShowPassword,
}) => (
  <>
    <div className="flex flex-col sm:flex-row gap-3">
      <CollegeFileUpload label="College Logo" name="college-logo"
        file={files.logo} onChange={(f) => handleFile('logo', f)} error={errors.logo} />
      <CollegeFileUpload label="College Image" name="college-img"
        file={files.collegeImg} onChange={(f) => handleFile('collegeImg', f)} error={errors.collegeImg} />
    </div>

    <CollegeInput label="Website URL" name="websiteUrl" value={formData.websiteUrl}
      onChange={handleChange} error={errors.websiteUrl} placeholder="https://www.college.edu" />

    <div className="flex flex-col sm:flex-row gap-3">
      <CollegeInput label="Instagram URL" name="instagramUrl" value={formData.instagramUrl}
        onChange={handleChange} error={errors.instagramUrl} placeholder="https://instagram.com/..." half />
      <CollegeInput label="LinkedIn URL" name="linkedInUrl" value={formData.linkedInUrl}
        onChange={handleChange} error={errors.linkedInUrl} placeholder="https://linkedin.com/..." half />
    </div>

    {/* Password with visibility toggle */}
    <div>
      <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1">
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
      
      <div className="h-4 mt-1.5">
        {errors.password && (
          <p className="text-[11px] leading-none text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      {/* Password requirements */}
      <div className="flex flex-col gap-0.5 mt-2 text-[11px] text-slate-400">
        <span className={formData.password.length >= 8  ? 'text-emerald-500' : ''}>• At least 8 characters</span>
        <span className={/[A-Z]/.test(formData.password) ? 'text-emerald-500' : ''}>• One uppercase letter</span>
        <span className={/[0-9]/.test(formData.password) ? 'text-emerald-500' : ''}>• One number</span>
      </div>
    </div>
  </>
);
