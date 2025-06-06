import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}
type ActiveRoute =
  | "dashboard"
  | "submit-clearance"
  | "clearance-history"
  | "messages"
  | "profile";
export function MainLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [activeRoute, setActiveRoute] = useState<ActiveRoute>("dashboard");
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getActiveRoute = (): ActiveRoute => {
    const path = location.pathname;
    if (path.includes("submit-clearance")) return "submit-clearance";
    if (path.includes("clearance-history")) return "clearance-history";
    if (path.includes("profile")) return "profile";
    return "dashboard"; // default
  };
  const activeRoute = getActiveRoute();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        activeRoute={activeRoute}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <div
        className={`flex flex-col flex-1 w-0 overflow-hidden ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-8">
          <div
            className={` mx-auto ${
              sidebarCollapsed ? "max-w-[100rem]" : "max-w-[90rem]"
            }`}
          >
            {children}{" "}
          </div>
        </main>
      </div>
    </div>
  );
}
