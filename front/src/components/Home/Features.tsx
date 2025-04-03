import { Bell, Clock, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Track your clearance status instantly with live updates from all departments.'
  },
  {
    icon: Zap,
    title: 'Easy Approvals',
    description: 'Streamlined approval process with automatic routing to relevant departments.'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get timely reminders and updates about your clearance progress.'
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'Enterprise-grade security ensuring your data remains protected.'
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-white" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Features that Make a Difference
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}