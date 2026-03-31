
import React from 'react';
import { PROCESS_STEPS, IconMap } from './components/constants';

const Process: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-4">Step-by-Step Flow</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Seamless Clearance Path</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            From initial submission to final certification, we've optimized every interaction to be as fluid and transparent as possible.
          </p>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden lg:flex items-start justify-between relative px-10">
          {/* Connecting line */}
          <div className="absolute top-10 left-32 right-32 h-0.5 bg-slate-100 dark:bg-slate-800 z-0"></div>

          {PROCESS_STEPS.map((step, idx) => {
            const isLast = idx === PROCESS_STEPS.length - 1;
            const ChevronRight = IconMap['ChevronRight'];

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center max-w-[200px] group">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-md group-hover:scale-110 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <span className="text-2xl font-black">{step.id}</span>
                </div>

                <div className="mt-8 text-center">
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{step.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>

                {!isLast && (
                  <div className="absolute top-8 -right-4 text-slate-300 dark:text-slate-700 opacity-50 group-hover:translate-x-2 transition-transform">
                    <ChevronRight size={32} strokeWidth={1} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden flex flex-col gap-12 relative px-4">
          {/* Connecting line */}
          <div className="absolute top-0 bottom-0 left-10 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

          {PROCESS_STEPS.map((step) => (
            <div key={step.id} className="relative z-10 flex gap-6 items-start">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-lg font-bold">
                {step.id}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">{step.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
