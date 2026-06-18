import { 
  BarChart3, Users, 
  Settings2, ClipboardCheck
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface AdminEventActionsProps {
  status: string;
}

export const AdminEventActions = ({ status }: AdminEventActionsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-50/80 rounded-2xl p-4 md:p-5 border border-indigo-100 shadow-sm overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-all duration-700" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Left: Section Header */}
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm">
              <Settings2 size={18} />
           </div>
           <div>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none mb-1">Administrative Suite</p>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Console Actions</h3>
           </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link to="analytics">
            <Button variant="outline" className="h-10 px-4 gap-2.5 rounded-xl border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 transition-all group">
              <BarChart3 size={14} className="text-slate-400 group-hover:text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
            </Button>
          </Link>

          <Link to="registrations">
            <Button variant="outline" className="h-10 px-4 gap-2.5 rounded-xl border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-600 transition-all group">
              <Users size={14} className="text-slate-400 group-hover:text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Registrations</span>
            </Button>
          </Link>

          <Link to="attendance">
            <Button variant="outline" className="h-10 px-4 gap-2.5 rounded-xl border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-600 transition-all group">
              <ClipboardCheck size={14} className="text-slate-400 group-hover:text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Attendance</span>
            </Button>
          </Link>

          <div className="w-px h-6 bg-indigo-100 mx-1 hidden md:block" />

          {/* New Status Capsule: Matched to Hero Style */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm ${
            status === 'COMPLETED' ? 'bg-slate-100 text-slate-500 border-slate-200' : 
            status === 'ONGOING' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
            'bg-blue-50 text-blue-500 border-blue-100'
          }`}>
             <div className={`w-1.5 h-1.5 rounded-full ${
               status === 'COMPLETED' ? 'bg-slate-400' : 
               status === 'ONGOING' ? 'bg-emerald-500' : 'bg-blue-500'
             } animate-pulse`} />
             <span className="text-[9px] font-black uppercase tracking-[0.2em]">{status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
