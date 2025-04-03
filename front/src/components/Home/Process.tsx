import { LogIn, Send, Activity, CheckCircle } from 'lucide-react';
const steps = [
  {
    icon: LogIn,
    title: 'Log In',
    description: 'Access your account securely'
  },
  {
    icon: Send,
    title: 'Submit Request',
    description: 'Initialize your clearance process'
  },
  {
    icon: Activity,
    title: 'Track Progress',
    description: 'Monitor departmental approvals'
  },
  {
    icon: CheckCircle,
    title: 'Get Cleared',
    description: 'Receive your clearance certificate'
  }
];

export default function Process() {
  return (
    <section className="py-16 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}