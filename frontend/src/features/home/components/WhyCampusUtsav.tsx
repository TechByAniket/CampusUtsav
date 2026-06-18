import React from 'react';
import { LayoutDashboard, QrCode, Users, BarChart3 } from "lucide-react";
import { FeaturesCard } from './FeaturesCard'; 

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <LayoutDashboard className="w-16 h-16 text-white" />,
    title: "Unified Command Center",
    description: "Ditch the scattered Google Forms. Manage approvals, schedules, and venues from a single dashboard."
  },
  {
    icon: <QrCode className="w-16 h-16 text-white" />,
    title: "Smart Check-ins",
    description: "Say goodbye to paper lists. Integrated QR-based ticketing makes registration and entry instant."
  },
  {
    icon: <Users className="w-16 h-16 text-white" />,
    title: "Boosted Engagement",
    description: "Students can easily discover fests, browse club profiles, and get notified about events they care about."
  },
  {
    icon: <BarChart3 className="w-16 h-16 text-white" />,
    title: "Real-Time Insights",
    description: "Track live attendance, analyze participation trends, and generate reports to improve future events."
  }
];

import { motion } from 'framer-motion';

export const WhyCampusUtsav: React.FC = () => {
  return (
    <section className="w-full bg-white py-10 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* --- HEADING START --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16 text-left"
        >
          <span className="block text-orange-600 font-bold text-sm uppercase tracking-widest mb-3">
            The Campus Advantage
          </span>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Why choose{' '}
            <span className="relative z-10 inline-block">
              <span className="relative z-10 text-slate-900">CampusUtsav</span>
              <span className="absolute -bottom-2 left-0 w-full h-4 bg-orange-600 opacity-20 -z-10 -rotate-2 rounded-sm"></span>
            </span>
            ?
          </h2>

          <p className="mt-6 text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
            Move beyond spreadsheets and disjointed tools. We provide the infrastructure 
            to make campus life smarter, faster, and more connected for everyone.
          </p>
        </motion.div>
        {/* --- HEADING END --- */}


        {/* --- CARDS GRID --- */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <FeaturesCard feature={feature} />
              </motion.div>
            ))}
        </motion.div>

      </div>
    </section>
  );
};