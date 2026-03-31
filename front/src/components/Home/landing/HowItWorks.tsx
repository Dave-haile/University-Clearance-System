import React, { useState } from 'react';
import { IconMap } from './components/constants';

const PERSPECTIVES = [
  {
    id: 'student',
    label: 'IU Student',
    icon: 'UserCircle',
    title: 'Focus on your Future, Not Paperwork',
    description: 'Avoid the stress of end-of-semester queues at Injibara University. Submit your request digitally, track department reviews from your dorm, and download your clearance certificate as soon as it is approved.',
    bullets: [
      'Visual progress bar for all IU departments',
      'Instant SMS alerts for status changes',
      'Digital certificate with QR verification',
      'Mobile-friendly student portal'
    ],
    color: 'blue'
  },
  {
    id: 'staff',
    label: 'IU Staff',
    icon: 'ShieldCheck',
    title: 'Simplified Review Workflows',
    description: 'Efficiently process student requests with a dedicated IU department dashboard. Dean of Students, Library Staff, and Department Heads can approve with a single click.',
    bullets: [
      'Bulk processing for end-of-year peak',
      'Digital audit history for every student',
      'Department-specific requirements',
      'Automated student notification system'
    ],
    color: 'emerald'
  },
  {
    id: 'registrar',
    label: 'IU Registrar',
    icon: 'ClipboardList',
    title: 'University-Wide Oversight',
    description: 'Gain ultimate control over the entire Injibara University clearance process. Generate comprehensive reports and ensure administrative compliance across all colleges.',
    bullets: [
      'IU-wide analytics and student flow data',
      'Final sign-off authority for graduation',
      'Secure data archiving per MOE standards',
      'System-wide settings and role management'
    ],
    color: 'indigo'
  }
];

const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState(PERSPECTIVES[0]);

  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-700 dark:text-blue-400 font-extrabold tracking-wider uppercase text-sm mb-4">Different Perspectives</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Designed for Our Community</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Whether you are a student in the College of Agriculture or a Registrar staff member, IU Digital Clearance is built for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Tabs */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {PERSPECTIVES.map((p) => {
              const Icon = IconMap[p.icon];
              const isActive = activeTab.id === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p)}
                  className={`flex items-center gap-4 p-6 rounded-2xl transition-all text-left border-2 ${isActive
                      ? 'border-blue-700 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-100 dark:shadow-none'
                      : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 grayscale opacity-70 hover:opacity-100'
                    }`}
                >
                  <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-700 dark:bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className={`block font-bold text-lg ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{p.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-tight">View Portal Features</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3 glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all duration-500">
            {/* Background decorative text */}
            <div className="absolute top-0 right-0 p-8 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
              <span className="text-9xl font-black uppercase text-slate-900 dark:text-white">{activeTab.id}</span>
            </div>

            <div className="relative z-10">
              <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">{activeTab.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                {activeTab.description}
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                {activeTab.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <IconMap.CheckCircle size={14} fill="currentColor" />
                    </div>
                    <span className="font-bold text-sm">{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 group/img">
                <div className="rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <img
                    src={`https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop`}
                    alt={`${activeTab.label} UI`}
                    className="w-full h-auto opacity-90 dark:opacity-80 transition-transform duration-700 group-hover/img:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;