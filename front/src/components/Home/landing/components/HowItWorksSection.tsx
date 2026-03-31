
import React from 'react';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const HowItWorksSection = () => {
  const userPerspectives = [
    {
      icon: GraduationCap,
      title: 'For Students',
      subtitle: 'Track your clearance progress in real-time',
      points: [
        'Submit clearance requests instantly',
        'Monitor approval status from each department',
        'Receive notifications at every step',
        'Download digital clearance certificate',
      ],
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Users,
      title: 'For Staff & Department Heads',
      subtitle: 'Approve or reject requests with detailed remarks',
      points: [
        'Review pending clearances efficiently',
        'Add detailed comments and feedback',
        'Bulk approve multiple requests',
        'Generate department-wise reports',
      ],
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: BookOpen,
      title: 'For Registrars',
      subtitle: 'Final oversight with comprehensive archive capabilities',
      points: [
        'Complete system oversight and control',
        'Access detailed audit trails',
        'Generate official certificates',
        'Maintain permanent digital records',
      ],
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our system is designed to serve every stakeholder in the university clearance process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {userPerspectives.map((perspective, index) => {
            const IconComponent = perspective.icon;
            
            return (
              <div
                key={index}
                className="bg-card rounded-xl p-8 shadow-sm border hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${perspective.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-8 w-8 ${perspective.color}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{perspective.title}</h3>
                <p className="text-muted-foreground mb-6">{perspective.subtitle}</p>
                
                <ul className="space-y-3">
                  {perspective.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${perspective.bgColor} rounded-full mt-2 flex-shrink-0`}></div>
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Security & Accuracy Highlights */}
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Built with Security, Speed & Accuracy in Mind
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="font-semibold mb-2">Enhanced Security</h4>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption and secure authentication protect all sensitive data
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="font-semibold mb-2">Lightning Fast</h4>
              <p className="text-sm text-muted-foreground">
                Cloud-based infrastructure ensures rapid processing and minimal downtime
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="font-semibold mb-2">100% Accurate</h4>
              <p className="text-sm text-muted-foreground">
                Automated workflows eliminate human error and ensure consistent processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
