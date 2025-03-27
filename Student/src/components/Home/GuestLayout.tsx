import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Hero from "./Hero";
import Features from "./Features";
import Process from "./Process";

const GuestLayout = () => {
  return (
    <div>
      <div className="main">
        <Header />
        {location.pathname === "/" ? (
          <>
            <Hero />
            <Features />
            <Process />
          </>
        ) : (
          <Outlet />
        )}
        <Footer />
      </div>
    </div>
  );
};

export default GuestLayout;
