import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf5] via-[#fff3e8] to-[#ffedd5] flex items-center justify-center px-4 py-8 selection:bg-orange-100 selection:text-orange-900">
      {/* Outer container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[950px] bg-white rounded-[2rem] shadow-[0_24px_80px_-12px_rgba(234,88,12,0.12)] grid grid-cols-1 lg:grid-cols-[42%_58%] overflow-hidden border border-orange-100/40 relative"
      >
        {/* LEFT – Branding & Illustration */}
        <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#fff1dc] via-[#ffe8c8] to-[#ffddb3] px-8 py-6">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose-300/15 blur-3xl" />

          {/* Brand logo */}
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Campus<span className="text-orange-500">Utsav</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 tracking-wide">
              College Events • Students • Experiences
            </p>
          </div>

          {/* Welcome text */}
          <div className="relative z-10 space-y-1.5 mt-3">
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Your Campus,<br />
              <span className="text-orange-600">One Platform</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[280px]">
              Manage events, track attendance, and connect with your campus community — all in one place.
            </p>
          </div>

          {/* Illustration */}
          <div className="relative z-10 flex-1 flex items-end justify-center mt-2">
            <motion.img
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              src="/home/login_illustration.png"
              alt="Campus community illustration"
              className="w-full max-w-[280px] object-contain drop-shadow-lg"
            />
          </div>

          {/* Footer */}
          <p className="relative z-10 text-[10px] text-slate-400 mt-2">
            © CampusUtsav 2026 • Privacy Policy
          </p>
        </div>

        {/* RIGHT – Auth Card */}
        <div className="flex flex-col justify-center px-6 py-5 md:px-10 md:py-6 overflow-y-auto max-h-[95vh] lg:max-h-none">
          {/* Mobile brand (shown only on small screens) */}
          <div className="lg:hidden mb-6">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Campus<span className="text-orange-500">Utsav</span>
            </h1>
          </div>

          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};
