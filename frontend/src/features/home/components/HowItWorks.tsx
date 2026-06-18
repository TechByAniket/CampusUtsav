
import React from 'react';
import { motion } from 'framer-motion';

export const HowItWorks = () => {
  return (
    <section className="w-full bg-white py-10 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* --- UNIQUE HEADING START: Centered Block Style --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="block text-orange-600 font-semibold text-base uppercase tracking-widest mb-3">
            The Digital Event Lifecycle
          </span>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Seamlessly Execute, Step by Step.
          </h2>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-16 h-1 bg-orange-600 mx-auto mt-6 rounded-full"
          />
        </motion.div>
        {/* --- UNIQUE HEADING END --- */}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12"
        >
            <div className="hidden md:block">
                <div className="h-[60vh] bg-slate-50 flex items-center justify-center text-slate-500 rounded-3xl border border-slate-100 overflow-hidden shadow-2xl">
                    <img src="/home/HowItWorksDesktop.png" 
                        alt="How It Works Infographics"
                        className='w-full h-full object-cover' 
                    />
                </div>
            </div>
            <div className="block md:hidden">
                <div className="h-[70vh] bg-slate-50 flex items-center justify-center text-slate-500 rounded-3xl border border-slate-100 overflow-hidden shadow-xl">
                    <img src="/home/HowItWorksMobile.png" 
                        alt="How It Works Infographics"
                        className='w-full h-auto object-contain' 
                    />
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};