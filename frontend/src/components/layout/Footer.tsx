import React from 'react';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  ArrowUpRight,
  ShieldCheck,
  Globe
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/60 pt-20 pb-10 font-jakarta">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-0.5 group cursor-pointer">
              <span className="text-2xl font-black tracking-tighter text-orange-600 group-hover:scale-105 transition-transform duration-300">
                Campus
              </span>
              <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:scale-105 transition-transform duration-300">
                Utsav
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              The definitive institutional platform for event discovery, management, and student engagement. Empowering campus communities through technology.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all shadow-sm">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform</h3>
            <ul className="space-y-4">
              {['Explore Events', 'Institutional Clubs', 'Faculty Hub', 'Student Dashboard'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center group">
                    {link}
                    <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Support</h3>
            <ul className="space-y-4">
              {['Help Center', 'API Documentation', 'Community Guidelines', 'Contact Support'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
            <div className="pt-2 flex items-center gap-2 text-indigo-600">
               <Mail size={16} />
               <span className="text-xs font-black uppercase tracking-widest">hello@campusutsav.com</span>
            </div>
          </div>

          {/* Legal & Security */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance</h3>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Security Standards'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
               <ShieldCheck size={12} />
               <span>Institutional Grade Security</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © {currentYear} CampusUtsav. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
