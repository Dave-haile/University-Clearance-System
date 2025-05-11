import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "../../lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

// const MainLayout = ({ children, className }: MainLayoutProps) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header />
//         <main className={cn("flex-1 p-4 md:p-6 overflow-y-auto", className)}>
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };
const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-60 h-screen fixed left-0 top-0 bg-white border-r z-50">
        <Sidebar />
      </div>
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Header />
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

export const MainLayout2 = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className={cn("flex-1 p-4 md:p-6 overflow-y-auto ", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};
