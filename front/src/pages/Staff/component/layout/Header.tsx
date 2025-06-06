import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import { User, Bell, ChevronRight, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Header = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { toggleSidebar, open, isMobile } = useSidebar();

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        {isMobile && (
          <div className="absolute left-0 top-0 mt-5 pl-1 hover:cursor-pointer">
            <button onClick={() => toggleSidebar()}>
              <Menu className="h-7 w-7" />
            </button>
          </div>
        )}
        <div className="relative max-w-md md:block">
          <h1
            className={`flex items-center justify-center ${
              isMobile && "pl-6"
            } gap-3 text-2xl sm:text-3xl font-bold text-slate-900`}
          >
            {!open && !isMobile && (
              <button>
                <ChevronRight
                  className="h-5 w-5"
                  onClick={() => toggleSidebar()}
                />
              </button>
            )}
            Staff Dashboard
          </h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => toast.info("Notifications clicked!")}
          className="rounded-full p-2 hover:bg-gray-100 relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-3 rounded-full hover:bg-gray-100 p-1"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <span className="hidden md:inline-block text-sm font-medium">
              {user?.name || "User"}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border animate-fade-in">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
