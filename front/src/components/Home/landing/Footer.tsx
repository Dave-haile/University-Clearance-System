import React from 'react';
import { GraduationCap, Github, Twitter, Linkedin, ArrowUp, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 pt-20 pb-10 transition-colors duration-300 border-t border-slate-800 dark:border-slate-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 p-2.5 rounded-xl text-white shadow-lg shadow-blue-900/50">
                <GraduationCap size={24} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Injibara <span className="text-blue-500">IU</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Knowledge for Development</span>
              </div>
            </div>
            <p className="leading-relaxed text-slate-400 text-sm">
              The official digital clearance portal of Injibara University. Modernizing administration for the future of Ethiopia.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <MapPin size={16} className="text-blue-500" />
                <span>Injibara, Awi Zone, Amhara, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Mail size={16} className="text-blue-500" />
                <span>info@injibara.edu.et</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Phone size={16} className="text-blue-500" />
                <span>+251 (0) 58 111 2222</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold mb-6 text-lg tracking-tight">University Sections</h5>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#home" className="hover:text-blue-400 transition-colors font-medium">IU Portal Home</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors font-medium">System Features</a></li>
              <li><a href="#process" className="hover:text-blue-400 transition-colors font-medium">Clearance Process</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors font-medium">User Roles</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-white font-bold mb-6 text-lg tracking-tight">IU Support</h5>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors font-medium">Registrar Office</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors font-medium">ICT Directorate</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors font-medium">Student Affairs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors font-medium">Help Center</a></li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex flex-col items-start lg:items-end">
             <button 
              onClick={scrollToTop}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-xl shadow-xl transition-all flex items-center gap-3 group mb-8 font-bold"
             >
               <span>Back to top</span>
               <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
             </button>
             <div className="flex items-center gap-4 mb-4">
                <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-700 transition-all text-white border border-slate-700">
                  <Twitter size={18} />
                </a>
                <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-700 transition-all text-white border border-slate-700">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-700 transition-all text-white border border-slate-700">
                  <Github size={18} />
                </a>
             </div>
             <p className="text-[10px] text-slate-600 text-left lg:text-right uppercase font-black tracking-widest">
               IU ERP System Component v3.4.0
             </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-slate-500 font-bold uppercase tracking-wider">
           <p>© {currentYear} Injibara University. All rights reserved.</p>
           <div className="flex gap-8">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Accessibility</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;