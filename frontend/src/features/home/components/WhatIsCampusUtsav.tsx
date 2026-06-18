import React from 'react';
import { motion } from 'framer-motion';

export const WhatIsCampusUtsav = () => {
  return (
    <section className="w-full bg-white py-10 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center w-full"
          >
            <img 
              src="/home/WhatIsCampusUtsav.jpeg" 
              alt="CampusUtsav Dashboard" 
              className="w-full h-auto object-contain shadow-2xl rounded-[2.5rem] border border-slate-100"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
              What is <span className="text-orange-600">CampusUtsav?</span>
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-slate-600 font-medium">
              {[
                "CampusUtsav is a centralized digital platform designed to simplify how colleges, clubs, and students connect, organize, and celebrate campus events.",
                "It brings every part of college event management — from event creation and registration to attendance tracking — into one seamless system.",
                "With CampusUtsav, colleges can digitize their fests, clubs can promote and manage events effortlessly, and students can explore, register, and participate with just a few clicks.",
                "Whether it’s a cultural fest, technical symposium, or inter-college competition — CampusUtsav makes managing and experiencing campus life smarter, simpler, and more connected."
              ].map((text, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
