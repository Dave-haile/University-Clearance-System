import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Building2,
  Settings,
  ChevronLeft,
  Menu,
  Bell,
  Search,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  ShieldAlert,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/authContext";

const SidebarLink: React.FC<{
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}> = ({ to, icon: Icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group relative text-sm
        ${isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
        }
      `}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && (
          <span className="font-medium whitespace-nowrap">{label}</span>
        )}
        {collapsed && (
          <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {label}
          </div>
        )}
      </NavLink>
    );
  };

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    setMobileOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-[15px]">
      {/* Sidebar - Desktop */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 hidden md:flex flex-col
          ${collapsed ? "w-[72px]" : "w-56"}
        `}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              AdminPro
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto scrollbar-hide">
          <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1.5">
            Main Menu
          </div>
          <SidebarLink
            to="/admin/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
          />
          <SidebarLink
            to="/admin/users"
            icon={Users}
            label="User Management"
            collapsed={collapsed}
          />
          <SidebarLink
            to="/admin/requests"
            icon={FileCheck}
            label="Clearance Requests"
            collapsed={collapsed}
          />
          <SidebarLink
            to="/admin/departments"
            icon={Building2}
            label="Departments"
            collapsed={collapsed}
          />
          <SidebarLink
            to="/admin/logs"
            icon={ShieldAlert}
            label="Audit Logs"
            collapsed={collapsed}
          />

          <div className="pt-4 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1.5">
            Reports
          </div>
          <SidebarLink
            to="/admin/reports/users"
            icon={BarChart3}
            label="User Reports"
            collapsed={collapsed}
          />
          <SidebarLink
            to="/admin/reports/requests"
            icon={FileCheck}
            label="Request Reports"
            collapsed={collapsed}
          />

          <div className="pt-4 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1.5">
            Support
          </div>
          <SidebarLink
            to="/admin/settings"
            icon={Settings}
            label="System Settings"
            collapsed={collapsed}
          />
          <SidebarLink
            to="/admin/help"
            icon={HelpCircle}
            label="Help Center"
            collapsed={collapsed}
          />
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => logout()}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors group text-sm">
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-56 bg-white dark:bg-slate-900 z-[60] transition-transform duration-300 md:hidden flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-14 flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-lg font-bold text-indigo-600">AdminPro</span>
        </div>
        <nav className="flex-1 p-3 space-y-1.5">
          <SidebarLink
            to="/admin/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={false}
          />
          <SidebarLink
            to="/admin/users"
            icon={Users}
            label="Users"
            collapsed={false}
          />
          <SidebarLink
            to="/admin/requests"
            icon={FileCheck}
            label="Requests"
            collapsed={false}
          />
          <SidebarLink
            to="/admin/departments"
            icon={Building2}
            label="Departments"
            collapsed={false}
          />
          <SidebarLink
            to="/admin/logs"
            icon={ShieldAlert}
            label="Logs"
            collapsed={false}
          />
          <SidebarLink
            to="/admin/reports/users"
            icon={BarChart3}
            label="User Reports"
            collapsed={false}
          />
          <SidebarLink
            to="/admin/reports/requests"
            icon={FileCheck}
            label="Request Reports"
            collapsed={false}
          />
          <SidebarLink
            to="/admin/settings"
            icon={Settings}
            label="Settings"
            collapsed={false}
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "md:ml-[72px]" : "md:ml-56"}`}
      >
        <header className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 transition-colors">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-xs w-56 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-[18px] h-[18px] text-amber-400" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>

            <button className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 mx-1.5 hidden md:block"></div>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isProfileDropdownOpen ? "bg-slate-100 dark:bg-slate-800" : ""}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-indigo-50 dark:ring-indigo-900/30 ring-offset-2 dark:ring-offset-slate-900">
                  {user?.name?.split(" ")[0][0]}{user?.name?.split(" ")[1][0]}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {user?.role}
                  </p>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none animate-fade-in z-[70] overflow-hidden transition-colors">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                      Settings
                    </Link>
                    <Link
                      to="/admin/help"
                      className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                      Help Center
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors group"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1360px] p-4 md:p-6 animate-fade-in text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
