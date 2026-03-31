import { useNavigate } from 'react-router-dom';
import { UserRole } from './components/types';
import { ROLE_CONFIG } from './components/constants';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/authContext';


const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    if (user && user.role) {
      const config = ROLE_CONFIG[user.role as UserRole];
      navigate(config.path);
    } else {
      navigate('/login');
    }
  };

  const ctaLabel = user && user.role
    ? ROLE_CONFIG[user.role as UserRole].label
    : 'Get Started';

  const ctaColor = user && user.role
    ? ROLE_CONFIG[user.role as UserRole].color
    : 'bg-blue-700 hover:bg-blue-800';

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-50"></div>

      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-emerald-100 dark:border-emerald-800/50">
              <GraduationCap size={16} />
              <span>Knowledge for Development</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Injibara University <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600 dark:from-blue-400 dark:to-emerald-400">
                Digital Clearance
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              A modern, paperless experience for students and staff. Fast-tracking your administrative journey with transparency and security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleCtaClick}
                className={`${ctaColor} text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:scale-105 transition-all flex items-center gap-2 group/cta`}
              >
                {ctaLabel}
                <ArrowRight size={20} className="group-hover/cta:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl font-bold text-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Learn More
              </button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-80">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-sm font-semibold">Authorized Portal</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldCheck size={18} className="text-blue-500" />
                <span className="text-sm font-semibold">Official IU Service</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Zap size={18} className="text-amber-500" />
                <span className="text-sm font-semibold">Real-time Approval</span>
              </div>
            </div>
          </div>

          <div className="relative group hidden lg:block">
            <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-400/5 rounded-[2.5rem] rotate-3 scale-95 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-emerald-600/5 dark:bg-emerald-400/5 rounded-[2.5rem] -rotate-2 scale-100 transition-transform duration-500"></div>

            <div className="relative bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src="/hero2.png"
                  alt="Academic Excellence"
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute top-10 left-8 glass p-5 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Registrar Status</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Ready for Sign-off</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-12 right-8 glass p-5 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">IU Clearance</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Digital ID Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;