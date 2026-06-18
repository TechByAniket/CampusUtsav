import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Heart } from 'lucide-react';

const ValueCard = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4"
  >
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
  </motion.div>
);

export const AboutValues: React.FC = () => {
  return (
    <section className="py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center space-y-4 mb-20">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Values that Drive us</h2>
           <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.4em]">Built on trust and innovation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard 
            icon={Target} 
            title="Focus" 
            description="We prioritize the student experience above all else, ensuring every feature adds real value to campus life."
            color="bg-slate-900"
          />
          <ValueCard 
            icon={Globe} 
            title="Inclusion" 
            description="Our platform is built to handle diverse cultural and technical needs of any institutional setup."
            color="bg-indigo-600"
          />
          <ValueCard 
            icon={Heart} 
            title="Passion" 
            description="We are a team of campus enthusiasts dedicated to making every event a resounding success."
            color="bg-rose-500"
          />
        </div>
      </div>
    </section>
  );
};
