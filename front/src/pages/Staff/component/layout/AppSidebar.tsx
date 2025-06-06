import {
  Home,
  User,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { cn } from "@/pages/Admin/lib/utils";
import { Link } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/staff/department_head/dashboard",
    active: true,
  },
  {
    name: "Clearance Requests",
    icon: FileText,
    href: "/staff/department_head/clearance-requests",
  },
  {
    name: "Students",
    icon: GraduationCap,
    href: "/staff/department_head/student",
  },
  { name: "Profile", icon: User, href: "/staff/department_head/profile" },
  { name: "Settings", icon: Settings, href: "/staff/department_head/settings" },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const { toggleSidebar, open } = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-lg font-bold text-blue-600">UniClear</h1>
          <button onClick={toggleSidebar} className="p-2 rounded-md">
            {open ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.active}
                    className={item.active ? "bg-blue-100 text-blue-700" : ""}
                  >
                    <Link to={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            "sidebar-item w-full justify-center text-left"
            // collapsed ? "" : ""
          )}
        >
          <LogOut className="h-5 w-5" />
          <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-sidebar-background px-2 py-1 text-sidebar-foreground opacity-0 transition-all group-hover:opacity-100">
            Logout
          </div>
        </button>
      </div>
    </Sidebar>
  );
}
