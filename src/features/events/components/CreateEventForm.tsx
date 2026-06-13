import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { fetchEventMetaData, createEvent, resubmitEvent } from '@/services/eventService';
import { getAllBranchesOfCollege } from '@/services/collegeService';
import type { AdminEventDetail } from '@/types/event';

import { Step1Details } from './create-event-form/Step1Details';
import { Step2Schedule } from './create-event-form/Step2Schedule';
import { Step3Uploads } from './create-event-form/Step3Uploads';

interface OnePageCreateEventFormProps {
  initialData?: AdminEventDetail | null;
  isModal?: boolean;
  onClose: () => void;
}

interface Attachment {
  key: string;
  value: string;
}

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface FormDataState {
  title: string;
  description: string;
  fees: number;
  venue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  eventCategory: string;
  eventType: string;
  teamEvent: boolean;
  minTeamSize: any;
  maxTeamSize: any;
  maxParticipants: number;
  registrationLink: string;
  allowed_branches: number[];
  allowed_years: number[];
  publicAttachments: Attachment[];
  privateAttachments: Attachment[];
  contactDetails: Contact[];
  poster: File | null;
}

export const OnePageCreateEventForm: React.FC<OnePageCreateEventFormProps> = ({ initialData = null, isModal = false, onClose }) => {
  const [step, setStep] = useState(1);
  const [metaData, setMetaData] = useState<Record<string, string[]>>({}); 
  const [collegeBranches, setCollegeBranches] = useState<Record<string, string>>({}); 
  const todayString = new Date().toISOString().split('T')[0];

  const collegeId = localStorage.getItem("collegeId") ? Number(localStorage.getItem("collegeId")) : null;
  const clubId = localStorage.getItem("profileId") ? Number(localStorage.getItem("profileId")) : null;

  const [formData, setFormData] = useState<FormDataState>({
    title: '', description: '', fees: 0, venue: '',
    startDate: '', endDate: '', startTime: '', endTime: '', registrationDeadline: '',
    eventCategory: '', eventType: '', teamEvent: false, 
    minTeamSize: 1, maxTeamSize: 1,
    maxParticipants: 100, registrationLink: '',
    allowed_branches: [], 
    allowed_years: [],    
    publicAttachments: [{ key: '', value: '' }],
    privateAttachments: [{ key: '', value: '' }],
    contactDetails: [{ name: '', phone: '', email: '' }],
    poster: null 
  });

  const years = [
    { id: 1, name: "FY" }, { id: 2, name: "SY" }, 
    { id: 3, name: "TY" }, { id: 4, name: "FINAL" }
  ];

  // --- AUTOFILL LOGIC ---
  useEffect(() => {
    if (initialData) {
      console.log("Initial Data:", initialData); 
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        fees: initialData.fees || 0,
        venue: initialData.venue || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        registrationDeadline: initialData.registrationDeadline || '',
        eventCategory: initialData.eventCategory || '',
        eventType: initialData.eventType || '',
        teamEvent: initialData.teamEvent || false,
        minTeamSize: initialData.minTeamSize || 1,
        maxTeamSize: initialData.maxTeamSize || 1,
        maxParticipants: initialData.maxParticipants || 100,
        registrationLink: initialData.registrationLink || '',
        
        allowed_branches: initialData.allowedBranches 
          ? Object.keys(initialData.allowedBranches).map(Number) 
          : [],
        allowed_years: initialData.allowedYears 
          ? Object.keys(initialData.allowedYears).map(Number) 
          : [],

        publicAttachments: initialData.publicAttachments 
          ? Object.entries(initialData.publicAttachments).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }],
        privateAttachments: initialData.privateAttachments 
          ? Object.entries(initialData.privateAttachments).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }],

        contactDetails: initialData.contactDetails 
          ? Object.entries(initialData.contactDetails).map(([name, info]: any) => ({ 
              name, 
              phone: info.phone || '', 
              email: info.email || '' 
            }))
          : [{ name: '', phone: '', email: '' }],
        poster: null
      });
    }
  }, [initialData]);

  // --- METADATA FETCH ---
  useEffect(() => {
    const initData = async () => {
      try {
        const [meta, branches] = await Promise.all([
          fetchEventMetaData(),
          getAllBranchesOfCollege(collegeId || 0) 
        ]);
        setMetaData(meta);
        setCollegeBranches(branches);

        if (!initialData) {
          const categories = Object.keys(meta);
          if (categories.length > 0) {
            setFormData(prev => ({
              ...prev,
              eventCategory: categories[0],
              eventType: meta[categories[0]][0] || ''
            }));
          }
        }
      } catch (err) {
        toast.error("Sync failed.");
      }
    };
    initData();
  }, [collegeId, initialData]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = e.target.value;
    setFormData(prev => ({
      ...prev,
      eventCategory: selectedCat,
      eventType: metaData[selectedCat] ? metaData[selectedCat][0] : ''
    }));
  };

  const toggleSelection = (field: 'allowed_branches' | 'allowed_years', id: string | number) => {
    const numericId = parseInt(id.toString());
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(numericId) ? prev[field].filter(i => i !== numericId) : [...prev[field], numericId]
    }));
  };

  const validateStep1 = () => {
    const { title, venue, description } = formData;
    if (!title || !venue || !description) {
      toast.error("Please fill in all required basic details.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { startDate, endDate, startTime, endTime, registrationDeadline, allowed_branches, allowed_years } = formData;
    
    if (!startDate || !endDate || !startTime || !endTime || !registrationDeadline) {
      toast.error("Please fill in all required scheduling fields.");
      return false;
    }

    if (startDate > endDate) {
      toast.error("End date cannot be before start date");
      return false;
    }

    if (allowed_branches.length === 0) {
      toast.error("Please select at least one target branch.");
      return false;
    }

    if (allowed_years.length === 0) {
      toast.error("Please select at least one target year.");
      return false;
    }

    if (formData.teamEvent) {
      if (formData.minTeamSize < 1 || formData.maxTeamSize < 1) {
        toast.error("Team sizes must be at least 1.");
        return false;
      }
      if (formData.minTeamSize > formData.maxTeamSize) {
        toast.error("Minimum team size cannot be greater than maximum team size");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.poster && !initialData) return toast.error("Poster is required.");

    try {
      const eventData = new FormData();
      const eventJson = {
        ...formData,
        id: initialData?.id || null, 
        public_attachments: formData.publicAttachments
          .filter(a => a.key && a.value)
          .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
        private_attachments: formData.privateAttachments
          .filter(a => a.key && a.value)
          .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
        contact_details: formData.contactDetails
          .filter(c => c.name)
          .reduce((acc, curr) => ({ 
            ...acc, 
            [curr.name]: { phone: curr.phone, email: curr.email } 
          }), {})
      };
      
      const payload: any = { ...eventJson };
      delete payload.poster;
      delete payload.publicAttachments;
      delete payload.privateAttachments;
      delete payload.contactDetails;
      delete payload.teamSize;

      eventData.append("event", new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      
      if (formData.poster) {
        eventData.append("file", formData.poster);
      } else {
        eventData.append("file", new Blob([], { type: 'application/octet-stream' }));
      }

      if (initialData) {
        await resubmitEvent(eventData, initialData.id);
        toast.success("Event Updated & Resubmitted!");
      } else {
        await createEvent(eventData, clubId || 0);
        toast.success("Event Created Successfully!");
      }

      onClose();
    } catch (err: any) {
      toast.error(err.message || "Operation failed.");
    }
  };

  return (
    <div className={`${isModal ? 'p-6 md:p-8' : 'w-full max-w-5xl mx-auto py-12 px-4 bg-gradient-to-br from-[#fffaf5] via-[#fff3e8] to-[#ffedd5] min-h-screen flex items-center justify-center'} font-sans text-slate-900 overflow-x-hidden selection:bg-orange-100`}>
      <div className={isModal ? 'space-y-6' : 'w-full max-w-4xl mx-auto bg-white rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(234,88,12,0.12)] border border-orange-100/40 p-8 md:p-12 space-y-6'}>
        
        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
           <div className="flex items-center gap-4">
              {/* Small high-quality flat-vector illustration */}
              <div className="relative flex items-center justify-center bg-gradient-to-br from-[#fff1dc] via-[#ffe8c8] to-[#ffddb3] rounded-2xl p-2 border border-orange-100/50 shadow-sm shrink-0">
                <svg className="w-12 h-12 text-orange-500 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="35" fill="url(#orangeGlow)" opacity="0.15" />
                  <rect x="32" y="28" width="36" height="42" rx="6" fill="#ffffff" stroke="#ffedd5" strokeWidth="1.5" />
                  <rect x="32" y="28" width="36" height="10" rx="6" fill="url(#orangeGrad)" />
                  <circle cx="42" cy="48" r="3" fill="#f97316" />
                  <circle cx="58" cy="48" r="3" fill="#e2e8f0" />
                  <circle cx="42" cy="58" r="3" fill="#e2e8f0" />
                  <circle cx="58" cy="58" r="3" fill="#e2e8f0" />
                  <path d="M72 16L74 21L79 23L74 25L72 30L70 25L65 23L70 21L72 16Z" fill="#f59e0b" />
                  <defs>
                    <linearGradient id="orangeGlow" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffedd5" />
                      <stop stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="orangeGrad" x1="50" y1="28" x2="50" y2="38" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f97316" />
                      <stop stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                 <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                    {step === 1 ? '1. Details' : step === 2 ? '2. Schedule' : '3. Uploads'}
                  </h2>
              </div>
           </div>

           <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      s < step 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-100' 
                        : s === step 
                          ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-md shadow-orange-200' 
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div 
                      className={`w-6 sm:w-10 h-0.5 mx-1 transition-all ${
                        s < step ? 'bg-orange-500' : 'bg-slate-100'
                      }`} 
                    />
                  )}
                </div>
              ))}
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <Step1Details
              formData={formData}
              setFormData={setFormData}
              metaData={metaData}
              handleCategoryChange={handleCategoryChange}
              validateStep1={validateStep1}
              setStep={setStep}
            />
          )}

          {step === 2 && (
            <Step2Schedule
              formData={formData}
              setFormData={setFormData}
              todayString={todayString}
              collegeBranches={collegeBranches}
              years={years}
              toggleSelection={toggleSelection}
              validateStep2={validateStep2}
              setStep={setStep}
            />
          )}

          {step === 3 && (
            <Step3Uploads
              formData={formData}
              setFormData={setFormData}
              initialData={initialData}
              setStep={setStep}
            />
          )}
        </form>
      </div>
    </div>
  );
};