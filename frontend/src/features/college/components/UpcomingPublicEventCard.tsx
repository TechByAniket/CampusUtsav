import React from 'react';
import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin, Building2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export const UpcomingPublicEventCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className='w-full group bg-white rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row gap-8'
    >
      {/* 1. Image Column */}
      <div className='w-full md:w-[350px] aspect-[4/3] md:aspect-auto overflow-hidden rounded-[2rem] relative'>
        <img 
          src='/event/CodeClashEvent.jpg'
          alt="Upcoming Event Banner" 
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm'>
          Public Event
        </div>
      </div>

      {/* 2. Content Column */}
      <div className='flex-1 flex flex-col justify-between py-2'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-indigo-600'>
              <Building2 size={14} />
              <span className='text-[10px] font-black uppercase tracking-widest'>Computer Society of India</span>
            </div>
          </div>
          
          <div>
            <h3 className='text-3xl font-black text-slate-900 tracking-tight leading-none mb-3'>Spring Fest 2024</h3>
            <p className='text-slate-500 text-sm leading-relaxed max-w-xl'>
              The biggest cultural celebration on campus. Join us for a weekend of music, dance, and technical innovation featuring workshops and grand performances.
            </p>
          </div>

          <div className='flex flex-wrap gap-6 pt-2'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-slate-50 rounded-xl text-slate-400'>
                <CalendarDays size={18} />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-slate-900'>March 12, 2024</span>
                <span className='text-[10px] font-medium text-slate-400'>10:00 AM - 05:00 PM</span>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='p-2 bg-slate-50 rounded-xl text-slate-400'>
                <MapPin size={18} />
              </div>
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-slate-900'>College Auditorium</span>
                <span className='text-[10px] font-medium text-slate-400'>Main Campus, Block B</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mt-8 pt-6 border-t border-slate-100'>
          <div className='flex -space-x-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400'>
                S{i}
              </div>
            ))}
            <div className='w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600'>
              +12
            </div>
          </div>
          
          <Button className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 py-6 font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-indigo-200 group-hover:translate-x-1'>
            View Details <ArrowRight size={14} className='ml-2' />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}