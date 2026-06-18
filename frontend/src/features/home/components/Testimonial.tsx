import React from 'react';
import { testimonials } from '@/lib/TestimonialData';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export const Testimonial = () => {
  return (
    <section className="w-full bg-white py-10 md:py-24">
        <div className="container mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="block text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                Testimonials
              </span>
              
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                What Real Organizers <br />Are Saying.
              </h2>
              
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-3xl mb-16">
                See how CampusUtsav transformed event management at leading clubs and institutions across the network.
              </p>
            </motion.div>

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
              className='grid grid-cols-1 md:grid-cols-3 gap-8'
            >
                {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                    >
                      <TestimonialCard 
                        quote={testimonial.quote}
                        name={testimonial.name}
                        role={testimonial.role}
                        avatar={testimonial.avatar}
                      />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  )
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatar }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 flex flex-col items-start gap-6 h-full"
    >
      <div className="text-orange-500 mb-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 8L4 16H10V24H18V16H14L18 8H10Z" fill="currentColor"/>
          <path d="M24 8L18 16H24V24H32V16H28L32 8H24Z" fill="currentColor"/>
        </svg>
      </div>

      <p className="text-slate-600 text-base font-medium leading-relaxed italic flex-grow">"{quote}"</p>

      <div className="flex items-center gap-4 mt-4">
        <div className="w-12 h-12 rounded-2xl border-2 border-orange-100 overflow-hidden shadow-sm">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <span className="font-black text-slate-900 text-sm tracking-tight">{name}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</span>
        </div>
      </div>
    </motion.div>
  );
};