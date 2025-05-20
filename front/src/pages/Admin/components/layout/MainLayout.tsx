import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "../../lib/utils";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean; // Add collapsed prop
}

const MainLayout = ({ children, className}: MainLayoutProps) => {

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className={cn(
        "h-screen fixed left-0 top-0 bg-white border-r z-50",
        collapsed ? "w-[60px]" : "w-60"
      )}>
        <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />
      </div>
      <div className={cn(
        "flex-1 flex flex-col min-h-screen",
        collapsed ? "ml-[50px]" : "ml-60"
      )}>
        <Header />
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-6 transition-all", className)}>
          {children}
        </main>
      </div>
    </div>
  )
};

export default MainLayout;
