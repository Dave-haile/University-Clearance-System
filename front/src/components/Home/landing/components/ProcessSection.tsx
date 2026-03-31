
import React, { useState, useEffect } from 'react';
import { FileText, UserCheck, Book, Coffee, CheckCircle } from 'lucide-react';

const ProcessSection = () => {
  const [visibleStep, setVisibleStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Student Submits Request',
      description: 'Student initiates clearance process through the digital platform',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 2,
      title: 'Department Head Review',
      description: 'Department heads review and approve academic clearances',
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 3,
      title: 'Library & Facilities Check',
      description: 'Library, proctor, and cafeteria verify no outstanding obligations',
      icon: Book,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: 4,
      title: 'Registrar Final Approval',
      description: 'Registrar conducts final review and grants official clearance',
      icon: Coffee,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      id: 5,
      title: 'Clearance Complete!',
      description: 'Student receives official clearance certificate digitally',
      icon: CheckCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const interval = setInterval(() => {
              setVisibleStep((prev) => {
                if (prev < steps.length - 1) {
                  return prev + 1;
                } else {
                  clearInterval(interval);
                  return prev;
                }
              });
            }, 600);
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('process');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How the Clearance Process Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined digital process ensures fast, accurate, and transparent clearance management
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border transform -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary transform -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{ width: `${(visibleStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="flex justify-between items-center relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isVisible = index <= visibleStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-30 transform translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`w-16 h-16 rounded-full ${step.bgColor} ${step.color} flex items-center justify-center mb-4 relative z-10 border-4 border-background shadow-lg transition-all duration-300 ${
                    isVisible ? 'scale-100' : 'scale-75'
                  }`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isVisible = index <= visibleStep;
            
            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 transition-all duration-500 ${
                  isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-30 transform translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`w-12 h-12 rounded-full ${step.bgColor} ${step.color} flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isVisible ? 'scale-100' : 'scale-75'
                }`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-background rounded-lg shadow-sm border">
            <div className="text-3xl font-bold text-primary mb-2">3 Days</div>
            <div className="text-muted-foreground">Average Processing Time</div>
          </div>
          <div className="text-center p-6 bg-background rounded-lg shadow-sm border">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Digital Process</div>
          </div>
          <div className="text-center p-6 bg-background rounded-lg shadow-sm border">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">System Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
