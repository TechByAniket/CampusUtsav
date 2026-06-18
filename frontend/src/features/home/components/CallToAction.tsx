import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CallToAction = () => {
  return (
    <section className="w-full bg-slate-900 py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -ml-48 -mt-48" />
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-10"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Your Next Successful Event is <br />
            <span className="text-orange-500">Just a Click Away!</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Onboard your college today and empower clubs, students, and faculty with one unified, high-performance platform.
          </p>

          <div className="flex justify-center pt-4">
            <Link to="/auth/sign-up">
              <Button size="lg" className="h-16 px-12 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-orange-500/20 active:scale-95">
                Get Started Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
