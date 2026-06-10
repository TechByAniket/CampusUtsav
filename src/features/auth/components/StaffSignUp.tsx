import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Phone, Briefcase,
  School, BadgeCheck, IdCard, GraduationCap, ArrowLeft,
  CheckCircle2, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

import { getAllRegisteredColleges, getAllBranchesOfCollege, getAllOfficialDomainsOfCollege } from '@/services/collegeService';
import { registerStaff } from '@/services/staffService';
import { getStaffDesignationsMeta } from '@/services/metaService';
import { StaffInput } from './staff/StaffInput';
import { StaffSelect } from './staff/StaffSelect';
import { StaffBrandingSection } from './staff/StaffBrandingSection';
import { StaffSocialLogins } from './staff/StaffSocialLogins';

interface StaffSignUpProps {
  onClose?: () => void;
}

export const StaffSignUp: React.FC<StaffSignUpProps> = ({ onClose }) => {
  const navigate = useNavigate();

  // ── DATA ──
  const [colleges, setColleges] = useState<any[]>([]);
  const [branches, setBranches] = useState<Record<string, string>>({});
  const [designations, setDesignations] = useState<{ code: string; label: string }[]>([]);
  const [officialDomains, setOfficialDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    employeeId: '',
    collegeId: '',
    branchId: '',
    designation: '',
  });

  // ── FETCH COLLEGES & DESIGNATIONS ON MOUNT ──
  useEffect(() => {
    (async () => {
      try {
        const collegesData = await getAllRegisteredColleges();
        setColleges(collegesData || []);
      } catch (err: any) {
        toast.error(err.message);
      }
      try {
        const designationsData = await getStaffDesignationsMeta();
        setDesignations(designationsData.designations || []);
      } catch (err: any) {
        toast.error(err.message);
      }
    })();
  }, []);

  // ── FETCH BRANCHES & DOMAINS WHEN COLLEGE CHANGES ──
  useEffect(() => {
    if (formData.collegeId) {
      setBranches({});
      setOfficialDomains([]);
      (async () => {
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
          console.warn("Could not fetch official domains");
        }
      })();
    }
  }, [formData.collegeId]);

  // ── HANDLERS ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'collegeId') {
      setFormData(prev => ({ ...prev, [name]: value, branchId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields: (keyof typeof formData)[] = ['name', 'email', 'phone', 'password', 'employeeId', 'collegeId', 'branchId', 'designation'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    }

    // Email Domain Validation
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

    if (!agreedTerms) {
      return toast.error('Please agree to the Terms & Conditions');
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        collegeId: parseInt(formData.collegeId),
        branchId: parseInt(formData.branchId),
      };
      await registerStaff(payload);
      toast.success('Staff Registration Successful!');
      setTimeout(() => {
        if (onClose) onClose();
        navigate('/auth/sign-in');
      }, 2000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── BRANCH OPTIONS (convert map → array) ──
  const branchOptions = Object.entries(branches).map(([id, name]) => ({ id, name }));

  // ── EMAIL STATUS FOR UX INDICATORS ──
  const isValidEmailDomain = formData.email && officialDomains.length > 0
    ? officialDomains.some(domain => formData.email.toLowerCase().endsWith(domain.toLowerCase()))
    : null;

  const emailSuffix = isValidEmailDomain !== null ? (
    isValidEmailDomain 
      ? <CheckCircle2 size={16} className="text-emerald-500 animate-in zoom-in duration-200" />
      : <XCircle size={16} className="text-rose-500 animate-in zoom-in duration-200" />
  ) : null;

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

        {/* ══════════════════════════════════════════════
            LEFT COLUMN — BRANDING & ILLUSTRATION
           ══════════════════════════════════════════════ */}
        <StaffBrandingSection />

        {/* ══════════════════════════════════════════════
            RIGHT COLUMN — REGISTRATION FORM
           ══════════════════════════════════════════════ */}
        <div className="flex flex-col justify-center px-6 py-5 md:px-8 md:py-6 overflow-y-auto max-h-[95vh] lg:max-h-none">
          
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
              Staff Registration
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Create your faculty account to get started
            </p>
          </div>

          {/* Social Logins */}
          <StaffSocialLogins />

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">or register with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ── THE FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Full Name */}
            <StaffInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={<User size={14} />}
              placeholder="Dr. John Doe"
            />

            {/* College ID + Branch ID side‑by‑side */}
            <div className="flex flex-col sm:flex-row gap-4">
              <StaffSelect
                label="College"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                icon={<School size={14} />}
                options={colleges.map((c: any) => ({ id: c.id, name: c.name }))}
                placeholder="Select college..."
                half
              />
              <StaffSelect
                label="Branch"
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                icon={<GraduationCap size={14} />}
                options={branchOptions}
                placeholder={formData.collegeId ? 'Select branch...' : 'Choose college first'}
                half
              />
            </div>

            {/* Email + Phone side‑by‑side */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1.5">
                <StaffInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail size={14} />}
                  placeholder="faculty@college.edu"
                  half
                  infoTooltip={officialDomains.length > 0 ? `Please register using your official email ending with: ${officialDomains.join(' or ')}` : "Select your college to see official email domain requirements."}
                  suffix={emailSuffix}
                />
              </div>
              <StaffInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<Phone size={14} />}
                placeholder="+91 98765 43210"
                half
              />
            </div>

            {/* Password */}
            <StaffInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={14} />}
              placeholder="••••••••"
            />

            {/* Employee ID + Designation side‑by‑side */}
            <div className="flex flex-col sm:flex-row gap-4">
              <StaffInput
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                icon={<IdCard size={14} />}
                placeholder="EMP-2026-001"
                half
              />
              <StaffSelect
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                icon={<Briefcase size={14} />}
                options={designations.map(d => ({ id: d.code, name: d.label }))}
                placeholder="Select designation..."
                half
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="staff-agree-terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 accent-orange-500 cursor-pointer"
              />
              <label htmlFor="staff-agree-terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <span className="text-orange-600 font-semibold hover:underline cursor-pointer">
                  Terms & Conditions
                </span>{' '}
                and{' '}
                <span className="text-orange-600 font-semibold hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto h-[46px] px-10 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 transition-all flex items-center justify-center gap-2 mx-auto sm:mx-0"
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
          </form>

          {/* Secondary link */}
          <p className="text-center sm:text-left text-sm text-slate-500 mt-3">
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
