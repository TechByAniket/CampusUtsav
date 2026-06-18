import React from 'react';
import { Zap, Users, ShieldCheck } from 'lucide-react';

export const AboutMission: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50/50 border-y border-slate-100">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Mission</h2>
              <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-6 text-lg">
                "To democratize institutional event management by providing every student and club with world-class tools to create, discover, and celebrate together."
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-4xl font-black text-slate-900">10k+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Students</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-slate-900">500+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Events Hosted</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-slate-900">50+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Colleges</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-slate-900">100%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Inclusion</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600/5 rounded-[4rem] -rotate-3 scale-105" />
            <div className="relative bg-white border border-slate-200 p-8 md:p-12 rounded-[4rem] shadow-2xl space-y-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Why we exist</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                     <Zap size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Efficiency First</p>
                    <p className="text-sm text-slate-500 font-medium">Removing administrative friction from club management.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                     <Users size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Student Centric</p>
                    <p className="text-sm text-slate-500 font-medium">Making discovery effortless for every individual.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Institution Grade</p>
                    <p className="text-sm text-slate-500 font-medium">Security and transparency at every level of operations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
