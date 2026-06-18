import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Profile } from './Profile';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export const Navbar: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useNotifications();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-0.5 group">
          <span className="text-2xl font-black tracking-tighter text-orange-600 group-hover:scale-105 transition-transform duration-300">
            Campus
          </span>
          <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:scale-105 transition-transform duration-300">
            Utsav
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <li>
            <Link to="/" className="hover:text-orange-600 transition-colors duration-200">Home</Link>
          </li>
          <li>
            <Link to="/explore-events" className="hover:text-orange-600 transition-colors duration-200">Explore Events</Link>
          </li>
          {token && (role === 'ROLE_STUDENT') && (
            <li>
              <Link to="/users/registrations" className="hover:text-orange-600 transition-colors duration-200">My Registrations</Link>
            </li>
          )}
          <li>
            <Link to="/about" className="hover:text-orange-600 transition-colors duration-200">About Us</Link>
          </li>
        </ul>

        {/* Action Area: Profile if logged in, Login if not */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-3">
              {role === 'ROLE_STUDENT' && (
                <Link
                  to="/notifications"
                  className="relative p-2.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center justify-center shrink-0"
                  aria-label="View notifications"
                >
                  <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white shadow-md">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <Profile />
            </div>
          ) : (
            <>
              <Link to="/auth/sign-in">
                <Button variant="ghost" className="hidden sm:flex text-slate-600 font-black uppercase text-[10px] tracking-widest px-4 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[10px] tracking-widest px-6 py-5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
