import React from "react";
import Navbar from "./common/Navbar";
import AnimatedRoutes from "./layout/AnimatedRoutes";
import ScrollToTop from "./common/ScrollToTop";

// Simplified component that just renders the main content immediately
const IntroContent = () => {
  return (
    <div className="relative" id="container">
      <main id="main" style={{ backgroundColor: "rgb(17, 24, 39)" }}>
        <ScrollToTop />
        <AnimatedRoutes />
      </main>
    </div>
  );
};

// Wrapper component that provides Router context
const Intro = () => {
  return (
    
      <IntroContent />
  );
};

export default Intro;