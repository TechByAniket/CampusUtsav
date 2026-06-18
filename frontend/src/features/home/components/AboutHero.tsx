import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-32 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="max-w-3xl space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100/50"
          >
            <Sparkles size={12} />
            <span>Our Story & Vision</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Empowering <br />
            <span className="text-indigo-600">Campus</span> Communities
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl"
          >
            CampusUtsav was born out of a simple necessity: to bridge the gap between students, clubs, and institutional management through a unified, high-performance digital ecosystem.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
