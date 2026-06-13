import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  CalendarDays,
  Shapes,
  GraduationCap,
  Users2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronRight as BreadcrumbSeparator,
  Bell,
} from "lucide-react";
import { Profile } from "@/components/layout/Profile";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDashboardCounts } from "@/hooks/useDashboardCounts";
import { useNotifications } from "@/hooks/useNotifications";

export const CollegeDashboardLayout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pendingClubsCount, pendingStaffCount, inboxCount } = useDashboardCounts();
  const { unreadCount } = useNotifications();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const pageTitles: Record<string, string> = {
    "/college-dashboard": "Overview",
    "/college-dashboard/overview": "Overview",
    "/college-dashboard/inbox": "Inbox",
    "/college-dashboard/events": "Events",
    "/college-dashboard/students": "Students",
    "/college-dashboard/clubs": "Clubs",
    "/college-dashboard/staff": "Staff",
    "/college-dashboard/events/:id/registrations": "Event Registrations",
    "/college-dashboard/events/:id/attendance": "Event Attendance",
    "/notifications": "Notifications",
  };

  const getPageTitle = (pathname: string): string => {
    if (pageTitles[pathname]) return pageTitles[pathname];
    const targetKey = Object.keys(pageTitles).find((key) => {
      if (!key.includes(':')) return false;
      const pattern = new RegExp(
        `^${key.replace(/:[^\/]+/g, '[^/]+').replace(/\//g, '\\/')}$`
      );
      return pattern.test(pathname);
    });
    return targetKey ? pageTitles[targetKey] : "CampusUtsav";
  };

  const decodeUrlSegment = (segment: string) => {
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((p) => p);
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      const title = getPageTitle(url);
      return {
        label: title !== "CampusUtsav" ? title : decodeUrlSegment(path),
        path: url,
      };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const pageTitle = getPageTitle(location.pathname);

  const sidebarLinks = [
    {
      label: "Overview",
      path: "/college-dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      label: "Inbox",
      path: "/college-dashboard/inbox",
      icon: Mail,
    },
    {
      label: "Events",
      path: "/college-dashboard/events",
      icon: CalendarDays,
    },
    {
      label: "Clubs",
      path: "/college-dashboard/clubs",
      icon: Shapes,
    },
    {
      label: "Students",
      path: "/college-dashboard/students",
      icon: GraduationCap,
    },
    {
      label: "Staff",
      path: "/college-dashboard/staff",
      icon: Users2,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
  ];

  return (
    <div className="flex w-full min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? "80px" : "280px",
          x: isMobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30.2 }}
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col bg-slate-900 border-r border-slate-800 shadow-2xl
          ${isMobileMenuOpen ? "flex" : "hidden lg:flex"}
        `}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-white"
            >
              <span className="text-orange-500">Campus</span>Utsav
            </motion.h1>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">CU</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden hover:bg-slate-800 text-slate-400 rounded-xl"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative group flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 outline-none
                  ${
                    isActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`shrink-0 w-5 h-5 transition-colors ${
                    isActive ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Notification Badge */}
                {((item.label === 'Inbox' && inboxCount > 0) || 
                   (item.label === 'Clubs' && pendingClubsCount > 0) || 
                   (item.label === 'Staff' && pendingStaffCount > 0) ||
                   (item.label === 'Notifications' && unreadCount > 0)) && (
                  <div className={`
                    absolute ${isCollapsed ? 'top-2 right-2' : 'right-3'} 
                    bg-red-500 text-white text-[9px] font-black 
                    px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg shadow-red-200
                  `}>
                    {item.label === 'Inbox' ? inboxCount : (item.label === 'Clubs' ? pendingClubsCount : (item.label === 'Staff' ? pendingStaffCount : (unreadCount > 99 ? '99+' : unreadCount)))}
                  </div>
                )}

                {isActive && (
                  <motion.div
                    layoutId="college-active-pill"
                    className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
            {!isCollapsed ? (
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Administration</p>
                    <p className="text-xs text-slate-400 mb-3">Manage your college events and members.</p>
                    <Button variant="outline" className="w-full text-xs h-8 rounded-lg bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                        Help Center
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-orange-500 hover:bg-white/5 rounded-xl">
                        <Mail size={18} />
                    </Button>
                </div>
            )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "lg:pl-20" : "lg:pl-[280px]"}`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden hover:bg-slate-50 text-slate-500"
            >
              <Menu size={20} />
            </Button>
            
            <div className="flex flex-col">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
                    <span className="hover:text-slate-600 cursor-pointer transition-colors">College Admin</span>
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            <BreadcrumbSeparator size={10} className="shrink-0" />
                            <span className={idx === breadcrumbs.length - 1 ? "text-slate-900 font-bold" : "hover:text-slate-600 cursor-pointer transition-colors"}>
                                {crumb.label}
                            </span>
                        </div>
                    ))}
                </nav>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Bell Icon */}
             <Link
               to="/notifications"
               className="relative p-2.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center justify-center shrink-0"
               aria-label="View notifications"
             >
               <Bell size={20} className="group-hover:rotate-12 transition-transform" />
               {unreadCount > 0 && (
                 <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white shadow-md">
                   {unreadCount > 99 ? "99+" : unreadCount}
                 </span>
               )}
             </Link>
             <Profile />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative z-20">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

