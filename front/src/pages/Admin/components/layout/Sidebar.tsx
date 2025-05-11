import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/use-mobile";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../../../context/authContext";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={cn(
        "sidebar-item group flex items-center rounded-md px-3 py-2 transition-all duration-200",
        isActive ? "sidebar-item active" : ""
      )}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span className="ml-3">{label}</span>}
      {collapsed && (
        <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-sidebar-background px-2 py-1 text-sidebar-foreground opacity-0 transition-all group-hover:opacity-100">
          {label}
        </div>
      )}
    </NavLink>
  );
};

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { logout } = useAuth();

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "bg-sidebar flex flex-col h-screen transition-all duration-300 border-r border-sidebar-border shadow-sm",
        collapsed ? "w-[60px]" : "w-[240px]",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="font-bold text-lg text-sidebar-foreground">Admin</div>
        )}
        <button
          className={cn(
            "rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "mx-auto"
          )}
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        <SidebarLink
          to="/admin/Dashbord"
          icon={LayoutDashboard}
          label="Dashboard"
          collapsed={collapsed}
        />
        <SidebarLink
          to="/admin/users"
          icon={Users}
          label="Users"
          collapsed={collapsed}
        />
        <SidebarLink
          to="/admin/requests"
          icon={FileCheck}
          label="Requests"
          collapsed={collapsed}
        />
        <SidebarLink
          to="/admin/departments"
          icon={Building2}
          label="Departments"
          collapsed={collapsed}
        />
        <SidebarLink
          to="/admin/settings"
          icon={Settings}
          label="Settings"
          collapsed={collapsed}
        />
      </nav>

      {/* Sidebar Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            "sidebar-item w-full text-left",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
          {collapsed && (
            <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-sidebar-background px-2 py-1 text-sidebar-foreground opacity-0 transition-all group-hover:opacity-100">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
