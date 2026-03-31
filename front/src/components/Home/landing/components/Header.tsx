import { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const getRoleBasedButton = () => {
    if (!user) {
      return <Button onClick={() => navigate("/login")}>Login</Button>;
    }

    const roleConfig = {
      admin: { label: "Go to Admin Dashboard", path: "/admin/dashboard" },
      student: { label: "Go to Student Dashboard", path: "/student/dashboard" },
      department_head: {
        label: "Go to Department Panel",
        path: "/department/dashboard",
      },
      library_staff: {
        label: "Go to Library Panel",
        path: "/library/dashboard",
      },
      registrar: {
        label: "Go to Registrar Panel",
        path: "/registrar/dashboard",
      },
      proctor: {
        label: "Go to Dorm Proctor Panel",
        path: "/proctor/dashboard",
      },
      cafeteria: {
        label: "Go to Cafeteria Panel",
        path: "/cafeteria/dashboard",
      },
    };

    const config = roleConfig[user.role as keyof typeof roleConfig];

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden md:inline">
          Welcome, {user.role.replace("_", " ")}
        </span>
        {/* <Button onClick={() => navigate(config?.path || "/")}>
          {config?.label || "Go to Dashboard"}
        </Button> */}
        <Button
          onClick={() => {
            if (user?.role === "student")
              return navigate("/student/submit-clearance");
            if (user?.role === "department_head")
              return navigate("/department_head/dashboard");
            if (user?.role === "admin") return navigate("/admin/Dashbord");
          }}
        >
          {config?.label || "Go to Dashboard"}
        </Button>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  };

  const navItems = [
    { label: "Home", id: "hero" },
    { label: "Features", id: "features" },
    { label: "Process", id: "process" },
    { label: "How It Works", id: "how-it-works" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              ClearanceHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">{getRoleBasedButton()}</div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-sm shadow-lg border-b">
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t">{getRoleBasedButton()}</div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
