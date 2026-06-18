import React from 'react';
import { stats } from '@/lib/StatsData';
import { motion } from 'framer-motion';

interface IndividualStatProps {
  label: string;
  value: string;
}

export const CommunityStats = () => {
  return (
    <section className="w-full bg-slate-950 py-24 md:py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -ml-48 -mb-48" />

        <div className="container mx-auto max-w-7xl px-6 text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-20"
            >
              Join Our <br />
              <span className="text-orange-500">Ever-Growing</span> Community
            </motion.h2>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className='grid grid-cols-1 md:grid-cols-4 gap-8'
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  show: { opacity: 1, scale: 1, y: 0 }
                }}
              >
                <IndividualStat label={stat.label} value={stat.value} />
              </motion.div>
            ))}
          </motion.div>
        </div>
    </section>
  )
}

const IndividualStat: React.FC<IndividualStatProps> = ({ label, value }) =>{
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-2 hover:bg-white/10 transition-all group">
            <h3 className="text-5xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform duration-500">
                {value}
            </h3>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">
                {label}
            </p>
        </div>
    )
}