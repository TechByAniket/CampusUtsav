import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

interface ClubHeroProps {
  name: string;
  shortForm: string;
  logoUrl?: string;
  collegeName: string;
  backLink: string;
}

export const ClubHero: React.FC<ClubHeroProps> = ({ name, shortForm, logoUrl, collegeName, backLink }) => {
  return (
    <div className="relative h-[320px] overflow-hidden mb-[-60px]">
      {/* Dynamic Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[#0F172A]" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(at_0%_0%,rgba(79,70,229,0.4)_0,transparent_50%),radial-gradient(at_100%_0%,rgba(249,115,22,0.15)_0,transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      
      {/* Navigation Layer */}
      <div className="absolute top-6 left-6 md:left-10 z-20">
         <Link to={backLink} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white rounded-xl transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Portal</span>
         </Link>
      </div>

      {/* Identity Core */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-center">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
              <div className="relative group">
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-indigo-500/30 transition-all opacity-0 group-hover:opacity-100" />
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 flex items-center justify-center shadow-2xl relative z-10">
                    {logoUrl ? (
                        <img src={logoUrl} alt={name} className="w-full h-full object-contain filter drop-shadow-lg" />
                    ) : (
                        <Users size={48} className="text-white/20" />
                    )}
                </div>
              </div>
              
              <div className="text-center md:text-left space-y-3 pb-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 bg-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-orange-950/20">
                        {shortForm}
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                        {collegeName}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
                    {name}
                </h1>
              </div>
          </div>
      </div>
    </div>
  );
};

