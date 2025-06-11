import { Shield, Bell, Smartphone, Clock, Users, FileText } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Role-Based Access Control",
      description:
        "Secure, permission-based access ensuring users only see what they need to see.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description:
        "Instant email and in-app notifications for status updates and approvals.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Smartphone,
      title: "Mobile-Responsive Design",
      description:
        "Access the system seamlessly from any device - desktop, tablet, or mobile.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Clock,
      title: "Real-Time Progress Tracking",
      description:
        "Track clearance status in real-time with detailed progress indicators.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Users,
      title: "Multi-Department Integration",
      description:
        "Seamless collaboration between all university departments and staff.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: FileText,
      title: "Fully Paperless System",
      description:
        "Complete digital workflow eliminating the need for physical paperwork.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Universities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage university clearances efficiently and
            securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={index}
                className="group p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className={`h-6 w-6 ${feature.color}`} />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Feature Highlights */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Why Choose ClearanceHub?
            </h3>
            <p className="text-muted-foreground">
              Built specifically for educational institutions with modern
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">
                Uptime Guarantee
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">GDPR</div>
              <div className="text-sm text-muted-foreground">
                Compliant Security
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">
                Support Available
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">Cloud</div>
              <div className="text-sm text-muted-foreground">
                Based Platform
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
