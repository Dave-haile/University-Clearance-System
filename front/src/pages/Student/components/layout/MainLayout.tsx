
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  History,
  Send,
  ChevronLeft,
  Menu,
  Bell,
  Search,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/authContext';

const SidebarLink: React.FC<{ to: string; icon: React.ElementType; label: string; collapsed: boolean }> = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-2.5 p-2 px-3 rounded-xl transition-all duration-300 group relative
        ${isActive
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
      `}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="font-bold text-xs tracking-tight whitespace-nowrap">{label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-1.5 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl">
          {label}
        </div>
      )}
    </NavLink>
  );
};

const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setMobileOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-500 hidden md:flex flex-col
          ${collapsed ? 'w-20' : 'w-60'}
        `}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-3 h-3" />
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">Student<span className="text-indigo-600">Pro</span></span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 p-5 space-y-3 overflow-y-auto scrollbar-hide">
          <div className={`text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-4 mb-4 ${collapsed ? 'text-center px-0' : ''}`}>
            {collapsed ? '•' : 'Navigation Hub'}
          </div>
          <SidebarLink to="/student/dashboard" icon={LayoutDashboard} label="Command Center" collapsed={collapsed} />
          <SidebarLink to="/student/submit-clearance" icon={Send} label="Submit Request" collapsed={collapsed} />
          <SidebarLink to="/student/clearance-history" icon={History} label="Registry Archive" collapsed={collapsed} />
          <SidebarLink to="/student/profile" icon={User} label="Identity Hub" collapsed={collapsed} />

          <div className="pt-8 space-y-3">
            <div className={`text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-4 mb-4 ${collapsed ? 'text-center px-0' : ''}`}>
              {collapsed ? '•' : 'Support'}
            </div>
            <SidebarLink to="/student/help" icon={HelpCircle} label="Documentation" collapsed={collapsed} />
          </div>
        </nav>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all group overflow-hidden"
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            {!collapsed && <span className="font-black text-xs tracking-tight">Revoke Session</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 z-[60] transition-transform duration-500 md:hidden flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">Student<span className="text-indigo-600">Pro</span></span>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          <SidebarLink to="/student/dashboard" icon={LayoutDashboard} label="Command Center" collapsed={false} />
          <SidebarLink to="/student/clearance" icon={Send} label="Submit Request" collapsed={false} />
          <SidebarLink to="/student/clearance-history" icon={History} label="Registry Archive" collapsed={false} />
          <SidebarLink to="/student/profile" icon={User} label="Identity Hub" collapsed={false} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${collapsed ? 'md:ml-20' : 'md:ml-60'}`}>
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-5 md:px-8 transition-colors">
          <div className="flex items-center gap-6">
            <button className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden lg:block group">
              <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Query institutional records..."
                className="pl-10 pr-5 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-[14px] text-xs font-bold w-64 focus:ring-3 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-[2px] border-white dark:border-slate-900"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isProfileDropdownOpen ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-black ring-3 ring-indigo-50 dark:ring-indigo-900/20">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900 dark:text-slate-100 leading-none">{user?.name.split(' ')[0]}</p>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Student</p>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in z-[70] overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                        {user?.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold truncate">ID: {user?.student?.student_id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link to="/student/profile" className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group">
                      <User className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                      View Identity
                    </Link>
                    <Link to="/student/help" className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group">
                      <HelpCircle className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                      Help Center
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all group"
                    >
                      <LogOut className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 animate-fade-in text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
