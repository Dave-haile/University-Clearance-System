
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, User, FileText, Settings } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/staff/department_head/dashboard", active: true },
    { name: "Clearance Requests", icon: FileText, href: "/staff/department_head/clearance=requests" },
    { name: "Settings", icon: Settings, href: "/staff/department_head/setting" },
    { name: "Profile", icon: User, href: "/staff/department_head/profile" },
  ];

  const NavLinks = ({ mobile = false }) => (
    <div className={`${mobile ? "flex flex-col space-y-4" : "hidden md:flex md:space-x-1"}`}>
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant={item.active ? "default" : "ghost"}
          className={`${mobile ? "justify-start" : ""} ${
            item.active 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
          onClick={() => mobile && setIsOpen(false)}
        >
          <item.icon className="w-4 h-4 mr-2" />
          {item.name}
        </Button>
      ))}
    </div>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">UniClear</h1>
            </div>
          </div>
          <NavLinks />
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="mt-6">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
