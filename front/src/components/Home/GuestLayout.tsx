import Header from "./landing/Header";
import Hero from "./landing/Hero";
import ProcessSection from "./landing/Process";
import FeaturesSection from "./landing/Features";
import HowItWorksSection from "./landing/HowItWorks";
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
        <Hero />
        <ProcessSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
