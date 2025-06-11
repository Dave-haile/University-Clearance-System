import Header from "./landing/Header";
import HeroSection from "./landing/HeroSection";
import ProcessSection from "./landing/ProcessSection";
import FeaturesSection from "./landing/FeaturesSection";
import HowItWorksSection from "./landing/HowItWorksSection";
import Footer from "./landing/Footer";
import { useAuth } from "@/context/authContext";
import { GoogleLoader } from "../ui/GoogleLoder";

const GuestLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <GoogleLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProcessSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
