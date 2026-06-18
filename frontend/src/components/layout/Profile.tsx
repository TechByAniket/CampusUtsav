import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { type RootState, type AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { accountMenuItems } from "@/services/userService";
import { 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  Home, 
  Compass, 
  Info, 
  Code 
} from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux Auth Intel
  const { email, role, studentSummary } = useSelector((state: RootState) => state.auth);

  const getDashboardPath = () => {
    switch (role) {
      case 'ROLE_COLLEGE':
      case 'ROLE_PRINCIPAL': return '/college-dashboard';
      case 'ROLE_FACULTY':
      case 'ROLE_HOD': return '/staff-dashboard';
      case 'ROLE_CLUB': return '/club-dashboard';
      default: return '/';
    }
  };

  const isStudent = !role || role === 'ROLE_USER' || role === 'ROLE_STUDENT';
  const dashboardLabel = isStudent ? 'Home' : 'Dashboard';
  const dashboardPath = isStudent ? '/' : getDashboardPath();

  const navLinks = [
    { label: dashboardLabel, path: dashboardPath, icon: Home },
    { label: "Explore Events", path: "/explore-events", icon: Compass },
    ...(isStudent ? [{ label: "My Registrations", path: "/users/registrations", icon: Sparkles }] : []),
    { label: "About Us", path: "/about", icon: Info },
  ];

  // Identity Mapping
  const displayName = studentSummary?.name || email?.split('@')[0] || "Coordinator";
  const displayRole = role?.replace('ROLE_', '').replace('_', ' ') || "College Admin";

  const handleAction = async (item: any) => {
    if (item.action === "navigate" && item.path) {
      navigate(item.path);
    }

    if (item.action === "logout") {
      try {
        dispatch(logout());
        navigate("/auth/sign-in");
        toast.success("Logged Out Successfully");
      } catch (err) {
        toast.error("Logout failed");
      }
    }
  };

  return (
    <div className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="
              h-12 flex items-center gap-2.5 px-3 rounded-2xl
              bg-white border border-slate-200/60 shadow-sm
              hover:bg-slate-50 hover:border-indigo-100 transition-all duration-300
              focus-visible:ring-2 focus-visible:ring-indigo-500/20 active:scale-95 group
            "
          >
            {/* Avatar Pulse Chip */}
            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-105 transition-transform">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} />
                <AvatarFallback className="bg-slate-900 text-white font-black text-[10px]">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-[1.5px] border-white rounded-full shadow-sm animate-pulse" />
            </div>

            <div className="hidden md:flex flex-col items-start text-left ml-1">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none truncate max-w-[100px]">
                {displayName}
              </span>
              <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-[0.15em] mt-1 flex items-center gap-1">
                 <ShieldCheck size={8} /> {displayRole}
              </span>
            </div>
            
            <ChevronDown size={14} className="text-slate-300 ml-1 group-hover:text-indigo-400 group-hover:translate-y-0.5 transition-all" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={15}
          className="
            w-64 rounded-[2rem] border border-slate-200/50
            bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]
            p-2 animate-in fade-in zoom-in-95 duration-200 font-jakarta overflow-hidden
          "
        >
          {/* --- NAVIGATION (Mobile for Students, Always for Admins) --- */}
          <div className={`${isStudent ? 'md:hidden' : ''} space-y-1 mb-2`}>
            <p className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Navigation</p>
            {navLinks.map((link) => (
              <DropdownMenuItem
                key={link.label}
                onClick={() => navigate(link.path)}
                className="
                  flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer
                  text-[10px] font-black uppercase tracking-wider
                  text-indigo-600 bg-indigo-50/50 transition-all duration-300
                  hover:bg-indigo-600 hover:text-white
                  focus:bg-indigo-600 focus:text-white
                "
              >
                <link.icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-2 bg-slate-50" />
            <p className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Account</p>
          </div>

          <div className="space-y-1">

            {accountMenuItems.map((item, index) => (
              <div key={item.label}>
                <DropdownMenuItem
                  onClick={() => handleAction(item)}
                  className="
                    flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer
                    text-[10px] font-black uppercase tracking-wider
                    text-slate-600 bg-slate-50/50 transition-all duration-300
                    hover:bg-indigo-600 hover:text-white
                    focus:bg-indigo-600 focus:text-white
                    group/item
                  "
                >
                  <item.icon className="h-3.5 w-3.5 text-slate-400 group-hover/item:text-white transition-colors" />
                  <span>{item.label}</span>
                </DropdownMenuItem>

                {/* Separator before Log Out */}
                {index === accountMenuItems.length - 2 && (
                  <div className="h-px bg-slate-50 my-1.5 mx-3" />
                )}
              </div>
            ))}



            {/* --- SIGN OUT --- */}
            <DropdownMenuItem
              onClick={() => handleAction({ action: "logout" })}
              className="
                flex items-center gap-3 rounded-2xl px-4 py-3
                cursor-pointer text-[10px] font-black uppercase tracking-widest
                text-rose-600 bg-rose-50/50 hover:bg-rose-600 hover:text-white
                transition-all duration-300 group/logout
              "
            >
              <LogOut className="h-3.5 w-3.5 group-hover/logout:scale-110 transition-transform" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
