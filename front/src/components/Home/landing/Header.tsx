import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_LINKS, ROLE_CONFIG } from './components/constants';
import { UserRole } from './components/types';
import { useAuth } from "@/context/authContext";
import { GraduationCap, Menu, X, Sun, Moon, LogOut } from 'lucide-react';


const Header = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    setIsDarkMode(document.documentElement.classList.contains('dark'));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const authCta = (isMobile = false) => {
    if (!user || !user.role) {
      return (
        <button
          onClick={handleLoginClick}
          className={`bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-800 hover:shadow-xl transition-all ${isMobile ? 'w-full' : ''}`}
        >
          Login
        </button>
      );
    }

    const config = ROLE_CONFIG[user.role as UserRole];
    return (
      <div className={`flex items-center gap-3 ${isMobile ? 'flex-col' : ''}`}>
        <button
          onClick={() => navigate(config.path)}
          className={`${config.color} text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all ${isMobile ? 'w-full' : ''}`}
        >
          {config.label}
        </button>
        <button
          onClick={logout}
          className={`p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all ${isMobile ? 'flex items-center gap-2' : ''}`}
          title="Logout"
        >
          <LogOut size={20} />
          {isMobile && <span className="font-bold">Logout</span>}
        </button>
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[rgba(255,255,255,0.7)] backdrop-blur-md py-3 shadow-md dark:bg-[rgba(15,23,42,0.7)]' : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="bg-blue-700 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-700/20">
            <GraduationCap size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              Injibara <span className="text-blue-700 dark:text-blue-400">IU</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Clearance</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-bold transition-colors"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {authCta()}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-xl transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] border-t dark:border-slate-800' : 'max-h-0'
          }`}
      >
        <ul className="flex flex-col p-6 gap-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => scrollToSection(link.href)}
                className="w-full text-left text-lg text-slate-700 dark:text-slate-200 font-bold py-3 border-b border-slate-50 dark:border-slate-800"
              >
                {link.name}
              </button>
            </li>
          ))}
          <li className="pt-4">
            {authCta(true)}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;