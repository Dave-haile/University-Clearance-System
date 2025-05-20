import React from "react";
import {
  LayoutDashboard,
  FileCheck,
  CheckCircle,
  MessageSquare,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { generateAvatar } from "@/pages/Admin/utils/avatarGenerator";
import { Link } from "react-router-dom";

type ActiveRoute =
  | "dashboard"
  | "submit-clearance"
  | "clearance-progress"
  | "messages"
  | "profile";
interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  activeRoute: ActiveRoute;
  setActiveRoute: (route: ActiveRoute) => void;
  onToggleCollapse: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
  isCollapsed,
}) => {
  return (
    <li>
      <Link
        to={`/student${onClick}`}
        className={`
          w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium
          transition-colors duration-150 ease-in-out
          ${
            isActive
              ? "bg-blue-800 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }
        `}
        title={isCollapsed ? label : undefined}
      >
        <span className={isActive ? "text-white" : "text-gray-500"}>
          {icon}
        </span>
        {!isCollapsed && <span>{label}</span>}
        {isActive && !isCollapsed && (
          <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
        )}
      </Link>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  activeRoute,
  setActiveRoute,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      click: '/dashboard',
    },
    {
      id: "submit-clearance",
      label: "Submit Clearance",
      icon: <FileCheck size={18} />,
      click: '/submit-clearance',
    },
    {
      id: "clearance-progress",
      label: "Clearance Progress",
      icon: <CheckCircle size={18} />,
      click: '/clearance-progress',
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare size={18} />,
      click: '/messages'
    },
    {
      id: "profile",
      label: "My Profile",
      icon: <User size={18} />,
      click: '/profile'
    },
  ];

  const { user, logout } = useAuth();
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <>
              <img
                src={
                  user?.profile_image ||
                  generateAvatar(user?.name) ||
                  user?.name.charAt(0)
                }
                alt={`${user?.name.charAt(0)}`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {user?.student?.student_id}
                </p>
              </div>
            </>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none hidden md:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeRoute === (item.id as ActiveRoute)}
                onClick={item.click}
                isCollapsed={isCollapsed}

              />
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
            }}
            className={`
              w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium
              text-red-600 hover:bg-red-50 transition-colors duration-150
            `}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={18} className="text-red-500" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
