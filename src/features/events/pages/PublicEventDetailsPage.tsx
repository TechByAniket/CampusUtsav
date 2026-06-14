import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Info } from 'lucide-react'

import type { AdminEventDetail } from '@/types/event'
import { getEventDetailsByEventId } from '@/services/eventService'
import type { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'

// Sub-components
import { SharedEventDetailHero } from '../components/SharedEventDetailHero'
import { SharedEventDetailOverview } from '../components/SharedEventDetailOverview'
import { SharedEventDetailContact } from '../components/SharedEventDetailContact'
import { SharedEventDetailStats } from '../components/SharedEventDetailStats'
import { PublicEventDetailRegistration } from '../components/PublicEventDetailRegistration'

/* ─── Helpers ─── */
const getStatusConfig = (status: string) => {
  switch (status.toUpperCase()) {
    case 'APPROVED':  return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', dot: 'bg-emerald-400', label: 'Approved', heroBg: 'bg-emerald-500/10', heroText: 'text-emerald-400' }
    case 'UPCOMING':  return { bg: 'bg-blue-500/20',  text: 'text-blue-300',  dot: 'bg-blue-400',  label: 'Upcoming',    heroBg: 'bg-blue-500/10',    heroText: 'text-blue-400' }
    case 'ONGOING':   return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', dot: 'bg-emerald-400 animate-pulse', label: 'Live Now', heroBg: 'bg-emerald-500/10', heroText: 'text-emerald-400' }
    case 'COMPLETED': return { bg: 'bg-slate-500/20',  text: 'text-slate-400',  dot: 'bg-slate-400',  label: 'Completed',   heroBg: 'bg-slate-500/10',   heroText: 'text-slate-400' }
    default:          return { bg: 'bg-amber-500/20',  text: 'text-amber-300',  dot: 'bg-amber-400',  label: status,        heroBg: 'bg-amber-500/10',   heroText: 'text-amber-400' }
  }
}

export const PublicEventDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<AdminEventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const student = useSelector((state: RootState) => state.auth.studentSummary)
  const role = useSelector((state: RootState) => state.auth.role)

  const fetchEventDetails = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await getEventDetailsByEventId(Number(id))
      setEvent(data)
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  useEffect(() => {
    const resetParentTransforms = () => {
      const el = document.querySelector('[data-public-event-details]');
      if (!el) return;
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        const style = parent.getAttribute('style') || '';
        if (parent.style.transform || parent.style.willChange || style.includes('transform') || style.includes('will-change')) {
          parent.style.transform = 'none';
          parent.style.willChange = 'auto';
          parent.style.filter = 'none';
        }
        parent = parent.parentElement;
      }
    };

    const timer = setTimeout(resetParentTransforms, 400);
    return () => clearTimeout(timer);
  }, [loading]);

  // Eligibility Logic
  const checkEligibility = () => {
    if (!event) return { eligible: true };
    if (!student) return { eligible: true }; // Form will handle login check

    const yearMapping: Record<string, string> = {
      "1": "FY",
      "2": "SY",
      "3": "TY",
      "4": "FINAL"
    };
    
    const studentYearLabel = yearMapping[String(student.year)] || String(student.year);
    
    const allowedBranches = Object.values(event.allowedBranches || {});
    const allowedYears = Object.values(event.allowedYears || {});
    
    const branchEligible = allowedBranches.length === 0 || allowedBranches.includes(student.branch);
    const yearEligible = allowedYears.length === 0 || allowedYears.includes(studentYearLabel);
    
    if (!branchEligible) return { eligible: false, reason: `Limited to ${allowedBranches.join(', ')} students.` };
    if (!yearEligible) return { eligible: false, reason: `Limited to ${allowedYears.join(', ')} only.` };
    
    return { eligible: true };
  };

  const { eligible, reason } = checkEligibility();

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#f0f2f5] font-sans">
        <div className="w-10 h-10 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Loading event details…</p>
      </div>
    )
  }

  // ── Not Found ──
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-[#f0f2f5] font-sans">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
          <Info size={32} />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Event Not Found</h2>
          <p className="text-sm text-slate-500">This event doesn't exist or has been removed.</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl h-11 px-6 text-sm font-semibold border-slate-200 hover:bg-slate-50">
          ← Go Back
        </Button>
      </div>
    )
  }

  // ── Data Prep ──
  const sc = getStatusConfig(event.status);

  return (
    <div data-public-event-details className="w-full min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 bg-[#f8fafc]">

      {/* Hero Banner */}
      <SharedEventDetailHero event={event} statusConfig={sc} isPublic={true} />

      {/* ╔══════════════════════════════════════════════════╗
          ║  CONTENT AREA — 65 / 35 Split                   ║
          ╚══════════════════════════════════════════════════╝ */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

          {/* ─── LEFT COLUMN (~65%) ─── */}
          <div className="lg:col-span-8 flex flex-col gap-7">

            {/* Registration Control Center — Mobile Only */}
            <div className="block lg:hidden">
               <PublicEventDetailRegistration 
                 eventId={event.id}
                 title={event.title}
                 status={event.status}
                 deadline={event.registrationDeadline}
                 minTeamSize={event.minTeamSize}
                 maxTeamSize={event.maxTeamSize}
                 isTeamEvent={event.teamEvent}
                 isEligible={eligible}
                 ineligibilityReason={reason}
                 allowedBranches={event.allowedBranches}
                 allowedYears={event.allowedYears}
               />
            </div>

            {/* Overview Card */}
            <SharedEventDetailOverview event={event} />

            {/* Need Help? — Contact Card */}
            <SharedEventDetailContact event={event} />
          </div>

          {/* ─── RIGHT COLUMN — Sticky Sidebar (~35%) ─── */}
          <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Registration Control Center — Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="hidden lg:block"
            >
               <PublicEventDetailRegistration 
                 eventId={event.id}
                 title={event.title}
                 status={event.status}
                 deadline={event.registrationDeadline}
                 minTeamSize={event.minTeamSize}
                 maxTeamSize={event.maxTeamSize}
                 isTeamEvent={event.teamEvent}
                 isEligible={eligible}
                 ineligibilityReason={reason}
                 allowedBranches={event.allowedBranches}
                 allowedYears={event.allowedYears}
               />
            </motion.div>

            {/* Quick Stats Card & Public Documents */}
            <SharedEventDetailStats event={event} statusConfig={sc} role={role} isPublic={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
