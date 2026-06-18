import React from 'react';
import { motion } from 'framer-motion';

export const StudentBrandingSection: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#fff1dc] via-[#ffe8c8] to-[#ffddb3] p-10">
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
      <div className="relative z-10 space-y-3 mt-8">
        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Welcome to the<br />
          <span className="text-orange-600">Student Network</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-[280px]">
          Join a vibrant community of learners, innovators, and campus leaders shaping the future.
        </p>
      </div>

      {/* Illustration */}
      <div className="relative z-10 flex-1 flex items-end justify-center mt-6">
        <motion.img
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          src="/home/student_illustration.png"
          alt="Student registration illustration"
          className="w-full max-w-[340px] object-contain drop-shadow-lg"
        />
      </div>

      {/* Footer */}
      <p className="relative z-10 text-[10px] text-slate-400 mt-6">
        © CampusUtsav 2026 • Privacy Policy
      </p>
    </div>
  );
};
