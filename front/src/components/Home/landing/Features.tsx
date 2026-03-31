
import React from 'react';
import { FEATURES, IconMap } from './components/constants';

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-4">Core Capabilities</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Designed for Modern Campuses</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Everything you need to digitize the university clearance experience, built with scalability and ease-of-use in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const IconComponent = IconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900 transition-all group"
              >
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <IconComponent size={28} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
