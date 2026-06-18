import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AboutCTA: React.FC = () => {
  return (
    <section className="w-full bg-slate-900 py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-6 text-center space-y-8">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Ready to Transform <br />
          <span className="text-indigo-500">Your Campus</span> Experience?
        </h2>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Join hundreds of institutions already using CampusUtsav to empower their students and automate their event ecosystems.
        </p>

        <div className="flex justify-center items-center pt-4">
          <Link to="/auth/sign-up">
            <Button size="lg" className="h-16 px-12 bg-white text-slate-900 hover:bg-indigo-500 hover:text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-indigo-500/10 active:scale-95">
              Register Your College
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
