import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, GraduationCap, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const { user } = useAuth();
  console.log(user);
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 pt-16"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Simplify University
                <span className="block text-primary">Clearance</span>
                <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground">
                  Fast, Digital, Seamless
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Transform your university clearance process with our modern
                digital platform. Real-time tracking, instant approvals, and
                seamless collaboration between all departments.
              </p>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                "Paperless Process",
                "Real-time Updates",
                "Role-based Access",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2"
                >
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user === null ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => {
                      <Link to={`/login`} />;
                    }}
                    className="text-lg px-8 py-6"
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-lg px-8 py-6"
                  >
                    Learn More
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={() => {
                    if (user?.role === "student")
                      return navigate("/student/submit-clearance");
                    if (user?.role === "department_head")
                      return navigate("/department_head/dashboard");
                    if (user?.role === "admin")
                      return navigate("/admin/Dashbord");
                  }}
                >
                  Go to Dashboard
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-border/50">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  Students Served
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">
                  Departments Connected
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">
                  Faster Processing
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Main Circle */}
              <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-12 h-12 bg-primary/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-8 h-8 bg-primary/40 rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-20 right-16 w-6 h-6 bg-primary/50 rounded-full animate-pulse delay-700"></div>

                {/* Central Icon */}
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                  <GraduationCap className="h-16 w-16 text-primary-foreground" />
                </div>
              </div>

              {/* Orbiting Elements */}
              <div
                className="absolute inset-0 animate-spin motion-reduce:animate-none"
                style={{ animationDuration: "20s" }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-primary/70 rounded-full"></div>
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary/80 rounded-full"></div>
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/60 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => scrollToSection("process")}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 group"
            aria-label="Scroll to Process Section"
            title="Scroll to Process Section"
          >
            <span className="text-sm">Discover More</span>
            <ArrowDown className="h-5 w-5 animate-bounce group-hover:animate-pulse" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
