import React from "react";
import Navbar from "./Navbar";
import AnimatedRoutes from "./AnimatedRoutes";
import ScrollToTop from "./ScrollToTop";

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