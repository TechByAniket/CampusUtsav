import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Phone, GraduationCap, 
  School, ArrowRight, ArrowLeft, 
  CheckCircle2, History, Hash, Laptop, 
  Globe, Users, Layers, BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

import { getAllRegisteredColleges, getAllBranchesOfCollege, getAllOfficialDomainsOfCollege } from '@/services/collegeService';
import { getClubsByCollege } from '@/services/clubService';
import { registerStudent } from '@/services/studentService';

import { StudentBrandingSection } from './student/StudentBrandingSection';
import { StudentInput } from './student/StudentInput';
import { StudentSelect } from './student/StudentSelect';

interface StudentSignUpProps {
    onClose?: () => void;
}

export const StudentSignUp: React.FC<StudentSignUpProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState<any>({});
    const [clubs, setClubs] = useState([]);
    const [officialDomains, setOfficialDomains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [agreedTerms, setAgreedTerms] = useState(false);
    // ... rest of state

    const [formData, setFormData] = useState({
        name: "",
        gender: "Male",
        identificationNumber: "", // College UID
        email: "",
        phone: "",
        password: "",
        rollNo: "",
        year: 1,
        division: "",
        admissionYear: new Date().getFullYear() - 1,
        graduationYear: new Date().getFullYear() + 3,
        skills: "",
        interests: "",
        collegeId: "",
        branchId: "",
        clubId: ""
    });

    // --- FETCH LOGIC ---
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
        setClubs([]);
        setOfficialDomains([]);
        const fetchExtras = async () => {
            try {
                const branchesData = await getAllBranchesOfCollege(formData.collegeId);
                setBranches(branchesData || {});
            } catch (err: any) {
                toast.error(err.message);
            }

            try {
                const clubsData = await getClubsByCollege(formData.collegeId);
                setClubs(clubsData || []);
            } catch (err) {
                setClubs([]);
            }

            try {
                const domainsData = await getAllOfficialDomainsOfCollege(formData.collegeId);
                setOfficialDomains(domainsData || []);
            } catch (err) {
                console.warn("Could not fetch official domains");
            }
        };
        fetchExtras();
    }
}, [formData.collegeId]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "collegeId") {
        setFormData(prev => ({ ...prev, [name]: value, branchId: "", clubId: "" }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- EMAIL DOMAIN VALIDATION ---
    if (officialDomains.length > 0) {
        const isOfficialEmail = officialDomains.some(domain => 
            formData.email.toLowerCase().endsWith(domain.toLowerCase())
        );
        if (!isOfficialEmail) {
            return toast.error(`Invalid Domain! Please use your official college email (${officialDomains.join(" or ")})`, {
                duration: 5000
            });
        }
    }

    setIsLoading(true);
    try {
        const payload = {
            ...formData,
            rollNo: parseInt(formData.rollNo),
            year: parseInt(String(formData.year)),
            admissionYear: parseInt(String(formData.admissionYear)),
            graduationYear: parseInt(String(formData.graduationYear)),
            collegeId: parseInt(formData.collegeId),
            branchId: parseInt(formData.branchId),
            clubId: formData.clubId ? parseInt(formData.clubId) : null
        };
        await registerStudent(payload);
        toast.success("Student Registration Successful");
        setTimeout(() => { if (onClose) onClose(); navigate('/auth/sign-in'); }, 2000);
    } catch (err: any) {
        toast.error(err.message);
    } finally { setIsLoading(false); }
};

    const steps = [
        { id: 1, label: "Campus" },
        { id: 2, label: "Identity" },
        { id: 3, label: "Academy" }
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
            <StudentBrandingSection />

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
                  Student Registration
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Create your student account to get started
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
                      <StudentCampusStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        colleges={colleges}
                        branches={branches}
                        clubs={clubs}
                      />
                    )}

                    {step === 2 && (
                      <StudentIdentityStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        setFormData={setFormData}
                        officialDomains={officialDomains}
                      />
                    )}

                    {step === 3 && (
                      <StudentAcademyStep
                        formData={formData}
                        handleInputChange={handleInputChange}
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
                        id="student-agree-terms"
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 accent-orange-500 cursor-pointer"
                      />
                      <label htmlFor="student-agree-terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
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
                        if (step === 1 && (!formData.collegeId || !formData.branchId)) return toast.error("Choose campus first.");
                        if (step === 2 && (!formData.name || !formData.email)) return toast.error("Personal details missing.");
                        setStep(prev => prev + 1);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-1.5 h-[42px] px-6 text-sm font-bold rounded-xl bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-100 transition-all"
                    >
                      Continue <ArrowRight size={16} />
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <BadgeCheck size={18} />
                          Create Account
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

interface StudentStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

interface StudentCampusStepProps extends StudentStepProps {
  colleges: any[];
  branches: any;
  clubs: any[];
}

const StudentCampusStep: React.FC<StudentCampusStepProps> = ({
  formData,
  handleInputChange,
  colleges,
  branches,
  clubs,
}) => (
  <div className="space-y-3">
    <h3 className="text-base font-bold text-slate-800">Institutional Onboarding</h3>

    {/* College */}
    <StudentSelect
      label="Select Institution"
      icon={<School size={14} />}
      name="collegeId"
      value={formData.collegeId}
      onChange={handleInputChange}
      options={Array.isArray(colleges) ? colleges.map((c: any) => ({ id: c.id, name: c.name })) : []}
      placeholder="Find your college..."
    />

    {/* Branch + Club (conditional) */}
    {formData.collegeId && (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <StudentSelect
          label="Engineering Branch"
          icon={<GraduationCap size={14} />}
          name="branchId"
          value={formData.branchId}
          onChange={handleInputChange}
          options={Object.entries(branches).map(([id, name]: [string, any]) => ({ id, name }))}
          placeholder="Specify branch..."
        />
        <StudentSelect
          label="Club Membership"
          icon={<Users size={14} />}
          name="clubId"
          value={formData.clubId}
          onChange={handleInputChange}
          options={Array.isArray(clubs) ? clubs.map((cl: any) => ({ id: cl.id, name: cl.name })) : []}
          placeholder="Independent student (No Club)"
          isOptional
        />
      </motion.div>
    )}

    {/* Extra context card to fill space */}
    <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-100/60 space-y-6 mt-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <School size={16} className="text-orange-500" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-700 leading-none">Connect to Campus</span>
          <span className="text-[11px] text-slate-400 leading-tight">
            Select your college to unlock branch, club, and domain-specific features for your student account.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <Users size={16} className="text-orange-500" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-700 leading-none">Join a Club</span>
          <span className="text-[11px] text-slate-400 leading-tight">
            Optionally join a campus club to participate in events and activities right from day one.
          </span>
        </div>
      </div>
    </div>
  </div>
);

const StudentAcademyStep: React.FC<StudentStepProps> = ({
  formData,
  handleInputChange,
}) => (
  <div className="space-y-3">
    <h3 className="text-base font-bold text-slate-800">Academic Standing</h3>

    {/* Roll No + Year side-by-side */}
    <div className="flex flex-col sm:flex-row gap-4">
      <StudentInput
        label="Roll Number"
        name="rollNo"
        type="number"
        value={formData.rollNo}
        onChange={handleInputChange}
        icon={<Hash size={14} />}
        placeholder="Ex: 42"
        half
      />
      <StudentSelect
        label="Current Year"
        icon={<GraduationCap size={14} />}
        name="year"
        value={String(formData.year)}
        onChange={handleInputChange}
        options={[1, 2, 3, 4].map(y => ({
          id: y,
          name: `${y}${y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year`
        }))}
        placeholder="Select year..."
        half
      />
    </div>

    {/* Division */}
    <StudentInput
      label="Division / Section"
      name="division"
      value={formData.division}
      onChange={handleInputChange}
      icon={<Layers size={14} />}
      placeholder="Ex: A or B"
    />

    {/* Admission + Graduation year (grouped card) */}
    <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-100/60 space-y-3">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Academic Timeline</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <StudentInput
          label="Admission Year"
          name="admissionYear"
          type="number"
          value={String(formData.admissionYear)}
          onChange={handleInputChange}
          icon={<History size={14} />}
          placeholder="2023"
          half
        />
        <StudentInput
          label="Graduation Year"
          name="graduationYear"
          type="number"
          value={String(formData.graduationYear)}
          onChange={handleInputChange}
          icon={<CheckCircle2 size={14} />}
          placeholder="2027"
          half
        />
      </div>
    </div>

    {/* Context info to fill space */}
    <div className="flex items-center gap-3 p-4 bg-orange-50/40 rounded-xl border border-orange-100/40">
      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
        <GraduationCap size={16} className="text-orange-500" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold text-slate-700 leading-none">Why we need this</span>
        <span className="text-[11px] text-slate-400 leading-tight">
          Your academic details help us personalize events, club recommendations, and campus experiences for your year and division.
        </span>
      </div>
    </div>

    {/* Password */}
    <StudentInput
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleInputChange}
      icon={<Lock size={14} />}
      placeholder="••••••••"
    />
  </div>
);

interface StudentIdentityStepProps extends StudentStepProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  officialDomains: string[];
}

const StudentIdentityStep: React.FC<StudentIdentityStepProps> = ({
  formData,
  handleInputChange,
  setFormData,
  officialDomains,
}) => (
  <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[520px] pr-1">
    <h3 className="text-base font-bold text-slate-800">Personal Identity</h3>

    {/* Full Name */}
    <StudentInput
      label="Full Name"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      icon={<User size={14} />}
      placeholder="Ex: John Doe"
    />

    {/* Gender + College UID side-by-side */}
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Gender picker */}
      <div className="flex-1 min-w-0 space-y-1">
        <label className="text-[11px] font-semibold text-slate-500 ml-0.5 flex items-center gap-1.5">
          <User size={14} /> Gender
        </label>
        <div className="flex p-1 bg-slate-50/80 rounded-xl border border-transparent">
          {["Male", "Female", "Other"].map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setFormData((prev: any) => ({ ...prev, gender: g }))}
              className={`flex-1 h-[38px] rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                formData.gender === g
                  ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <StudentInput
        label="College Identifier (UID)"
        name="identificationNumber"
        value={formData.identificationNumber}
        onChange={handleInputChange}
        icon={<Hash size={14} />}
        placeholder="Unique ID"
        half
      />
    </div>

    {/* Email + Phone side-by-side */}
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 min-w-0 space-y-1">
        <StudentInput
          label="Official Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          icon={<Mail size={14} />}
          placeholder="name@college.edu"
          half
          infoTooltip={
            officialDomains.length > 0
              ? `Use official email: ${officialDomains.join(' or ')}`
              : "Select your college to see email requirements."
          }
        />
        {officialDomains.length > 0 && (
          <p className="text-[9px] font-bold text-orange-500 px-3 py-1 bg-orange-50 rounded-full w-fit">
            Requires: {officialDomains.join(", ")}
          </p>
        )}
      </div>
      <StudentInput
        label="Contact Number"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        icon={<Phone size={14} />}
        placeholder="+91 98765 43210"
        half
      />
    </div>

    {/* Skills + Interests (grouped card) */}
    <div className="p-5 bg-orange-50/40 rounded-xl border border-orange-100/40 space-y-3">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Profile</p>
      <StudentInput
        label="Technical Skills"
        name="skills"
        value={formData.skills}
        onChange={handleInputChange}
        icon={<Laptop size={14} />}
        placeholder="Java, Python, UI/UX..."
      />
      <StudentInput
        label="Active Interests"
        name="interests"
        value={formData.interests}
        onChange={handleInputChange}
        icon={<Globe size={14} />}
        placeholder="Coding, Sports, Music..."
      />
    </div>
  </div>
);
