import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Phone, GraduationCap, 
  School, ArrowRight, ArrowLeft, 
  CheckCircle2, Globe, Users, 
  Layers, Info, Instagram, Linkedin, Camera,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

import { getAllRegisteredColleges, getAllBranchesOfCollege, getAllOfficialDomainsOfCollege } from '@/services/collegeService';
import { registerClub } from '@/services/clubService';

import { ClubBrandingSection } from './club/ClubBrandingSection';
import { ClubInput } from './club/ClubInput';
import { ClubSelect } from './club/ClubSelect';
import { ClubTextArea } from './club/ClubTextArea';
import { ClubFileInput } from './club/ClubFileInput';


interface ClubSignUpProps {
    onClose?: () => void;
}

export const ClubSignUp: React.FC<ClubSignUpProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState<any>({});
    const [officialDomains, setOfficialDomains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        adminName: "",
        shortForm: "",
        adminEmail: "",
        adminPhone: "",
        password: "",
        description: "",
        branchId: "",
        websiteUrl: "",
        instagramUrl: "",
        linkedInUrl: "",
        collegeId: ""
    });

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const data = await getAllRegisteredColleges();
                setColleges(data || []);
        } catch (err: any) {
            toast.error(err.message);
        }
    };
    fetchColleges();
}, []);

useEffect(() => {
    if (formData.collegeId) {
        setBranches({});
        setOfficialDomains([]);
        const fetchExtras = async () => {
            try {
                const branchesData = await getAllBranchesOfCollege(formData.collegeId);
                setBranches(branchesData || {});
            } catch (err: any) {
                toast.error(err.message);
            }

            try {
                const domainsData = await getAllOfficialDomainsOfCollege(formData.collegeId);
                setOfficialDomains(domainsData || []);
            } catch (err) {
                console.warn("Domain validation offline");
            }
        };
        fetchExtras();
    }
}, [formData.collegeId]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "collegeId") {
        setFormData(prev => ({ ...prev, [name]: value, branchId: "" }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            return toast.error("Image too heavy (> 2MB)");
        }
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (officialDomains.length > 0) {
        const isOfficialEmail = officialDomains.some(domain => 
            formData.adminEmail.toLowerCase().endsWith(domain.toLowerCase())
        );
        if (!isOfficialEmail) {
            return toast.error(`Access Denied! Use official college email (${officialDomains.join(" or ")})`);
        }
    }

    if (!logoFile) return toast.error("Club identity (Logo) required.");

    setIsLoading(true);
    try {
        const clubPayload = {
            ...formData,
            branchId: formData.branchId ? parseInt(formData.branchId) : null,
            collegeId: parseInt(formData.collegeId)
        };

        const data = new FormData();
        data.append("club", JSON.stringify(clubPayload));
        data.append("file", logoFile);

        await registerClub(data, formData.collegeId);
        toast.success("Club Registered Successfully!");
        setTimeout(() => { if (onClose) onClose(); navigate('/auth/sign-in'); }, 2000);
    } catch (err: any) {
        toast.error(err.message);
    } finally { setIsLoading(false); }
};

    const steps = [
        { id: 1, label: "Campus" },
        { id: 2, label: "Identity" },
        { id: 3, label: "Admin" }
    ];

    const percentage = Math.round((step / steps.length) * 100);

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

            {/* ══════════════════════════════════════════════
                LEFT COLUMN — BRANDING & ILLUSTRATION
               ══════════════════════════════════════════════ */}
            <ClubBrandingSection />

            {/* ══════════════════════════════════════════════
                RIGHT COLUMN — REGISTRATION FORM
               ══════════════════════════════════════════════ */}
            <div className="flex flex-col h-full px-6 py-5 md:px-8 md:py-6 overflow-hidden">
              
              {/* Back to Roles */}
              <button
                onClick={onClose}
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3 w-fit transition-colors group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to roles
              </button>

              {/* Mobile brand (shown only on small screens) */}
              <div className="lg:hidden mb-4">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Campus<span className="text-orange-500">Utsav</span>
                </h1>
              </div>

              {/* Form heading */}
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Club Registration
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Register your club to expand campus culture
                </p>
              </div>



              {/* ── PROGRESS BAR ── */}
              <div className="mb-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Step {step} of {steps.length} — {steps[step - 1].label}</span>
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

              {/* ── THE FORM ── */}
              <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                  <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 min-h-0"
                  >
                    {step === 1 && (
                      <ClubCampusStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        colleges={colleges}
                        branches={branches}
                      />
                    )}

                    {step === 2 && (
                      <ClubIdentityStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                      />
                    )}

                    {step === 3 && (
                      <ClubAdminStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleFileChange={handleFileChange}
                        logoPreview={logoPreview}
                        officialDomains={officialDomains}
                      />
                    )}
                  </motion.div>

                  </AnimatePresence>

                  {step === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 mt-4 pt-4 border-t border-slate-100"
                    >
                      <input
                        id="club-agree-terms"
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 accent-orange-500 cursor-pointer"
                      />
                      <label htmlFor="club-agree-terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                        I agree to the{' '}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline cursor-pointer">Terms & Conditions</a>
                        {' '}and{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline cursor-pointer">Privacy Policy</a>
                      </label>
                    </motion.div>
                  )}
                </div>

                {/* --- NAVIGATION --- */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 shrink-0">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(prev => prev - 1)}
                      className="flex items-center gap-1.5 h-[42px] px-5 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-black transition-all shadow-md shadow-slate-200"
                    >
                      <ArrowLeft size={16} /> Previous
                    </button>
                  ) : <div />}

                  {step < 3 ? (
                    <motion.button
                      type="button"
                      onClick={() => {
                        if (step === 1 && !formData.collegeId) return toast.error("Institution link required.");
                        if (step === 2 && (!formData.name || !formData.description || !formData.shortForm)) return toast.error("Club profile incomplete.");
                        setStep(prev => prev + 1);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-1.5 h-[42px] px-6 text-sm font-bold rounded-xl bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-100 transition-all"
                    >
                      Next <ArrowRight size={16} />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading || !agreedTerms}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto h-[46px] px-10 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Registering...
                        </>
                      ) : (
                        <>
                          <BadgeCheck size={18} />
                          Register Club
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>

              {/* Secondary link */}
              <p className="text-center sm:text-left text-sm text-slate-500 mt-3 shrink-0">
                Already have an account?{' '}
                <Link
                  to="/auth/sign-in"
                  className="text-orange-600 font-bold hover:underline hover:text-orange-700 transition-colors"
                >
                  Log in
                </Link>
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

interface ClubStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ClubCampusStep: React.FC<ClubStepProps & { colleges: any[]; branches: any }> = ({
  formData,
  handleInputChange,
  colleges,
  branches,
}) => (
  <div className="space-y-3">
    {/* Step title */}
    <h3 className="text-base font-bold text-slate-800">Campus Link</h3>

    {/* College */}
    <ClubSelect
      label="Host Institution"
      icon={<School size={14} />}
      name="collegeId"
      value={formData.collegeId}
      onChange={handleInputChange}
      options={colleges.map((c: any) => ({ id: c.id, name: c.name }))}
      placeholder="Find your college..."
    />

    {/* Branch (conditional) */}
    {formData.collegeId && (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <ClubSelect
          label="Departmental Hub"
          icon={<Layers size={14} />}
          name="branchId"
          value={formData.branchId}
          onChange={handleInputChange}
          options={Object.entries(branches).map(([id, name]: [string, any]) => ({ id, name }))}
          placeholder="Specify branch (if applicable)"
          isOptional
        />
      </motion.div>
    )}

    {/* Extra context to fill space when no college selected */}
    <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-100/60 space-y-6 mt-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <School size={16} className="text-orange-500" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-700 leading-none">Link to your Campus</span>
          <span className="text-[11px] text-slate-400 leading-tight">
            Select the college your club belongs to. This connects your club to the campus network and enables student discovery.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <Layers size={16} className="text-orange-500" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-700 leading-none">Department Association</span>
          <span className="text-[11px] text-slate-400 leading-tight">
            Optionally associate your club with a specific branch or department for better categorization.
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ClubIdentityStep: React.FC<ClubStepProps> = ({
  formData,
  handleInputChange,
}) => (
  <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[520px] pr-1">
    <h3 className="text-base font-bold text-slate-800">Club Profile</h3>

    {/* Club Name + Short Form side-by-side */}
    <div className="flex flex-col sm:flex-row gap-4">
      <ClubInput
        label="Organization Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        icon={<Users size={14} />}
        placeholder="Ex: Google Developer Group"
        half
      />
      <ClubInput
        label="Short Form"
        name="shortForm"
        value={formData.shortForm}
        onChange={handleInputChange}
        icon={<Layers size={14} />}
        placeholder="Ex: GDG"
        half
      />
    </div>

    {/* Description */}
    <ClubTextArea
      label="Mission & Description"
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      icon={<Info size={14} />}
      placeholder="Describe your club's purpose and activities..."
    />

    {/* Online Presence (grouped card) */}
    <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-100/60 space-y-3">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Online Presence</p>
      <ClubInput
        label="Website URL"
        name="websiteUrl"
        value={formData.websiteUrl}
        onChange={handleInputChange}
        icon={<Globe size={14} />}
        placeholder="https://..."
        isOptional
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <ClubInput
          label="Instagram"
          name="instagramUrl"
          value={formData.instagramUrl}
          onChange={handleInputChange}
          icon={<Instagram size={14} />}
          placeholder="@handle"
          half
        />
        <ClubInput
          label="LinkedIn"
          name="linkedInUrl"
          value={formData.linkedInUrl}
          onChange={handleInputChange}
          icon={<Linkedin size={14} />}
          placeholder="In/name"
          half
          isOptional
        />
      </div>
    </div>
  </div>
);

interface ClubAdminStepProps extends ClubStepProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoPreview: string | null;
  officialDomains: string[];
}

const ClubAdminStep: React.FC<ClubAdminStepProps> = ({
  formData,
  handleInputChange,
  handleFileChange,
  logoPreview,
  officialDomains,
}) => (
  <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[520px] pr-1">
    <h3 className="text-base font-bold text-slate-800">Administrative Access</h3>

    {/* Admin Full Name */}
    <ClubInput
      label="Admin Full Name"
      name="adminName"
      value={formData.adminName}
      onChange={handleInputChange}
      icon={<User size={14} />}
      placeholder="Person in-charge"
    />

    {/* Email + Phone side-by-side */}
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 min-w-0 space-y-1">
        <ClubInput
          label="Admin Email"
          name="adminEmail"
          type="email"
          value={formData.adminEmail}
          onChange={handleInputChange}
          icon={<Mail size={14} />}
          placeholder="official@college.edu"
          half
          infoTooltip={officialDomains.length > 0 ? `Use official email: ${officialDomains.join(' or ')}` : "Select your college to see email requirements."}
        />
        {officialDomains.length > 0 && (
          <p className="text-[9px] font-bold text-orange-500 px-3 py-1 bg-orange-50 rounded-full w-fit">
            Domain: {officialDomains.join(", ")}
          </p>
        )}
      </div>
      <ClubInput
        label="Admin Contact"
        name="adminPhone"
        value={formData.adminPhone}
        onChange={handleInputChange}
        icon={<Phone size={14} />}
        placeholder="+91 98765 43210"
        half
      />
    </div>

    {/* Password */}
    <ClubInput
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleInputChange}
      icon={<Lock size={14} />}
      placeholder="••••••••"
    />

    {/* Logo Upload */}
    <ClubFileInput
      label="Club Emblem / Logo"
      icon={<Camera size={14} />}
      onChange={handleFileChange}
      preview={logoPreview}
    />
  </div>
);