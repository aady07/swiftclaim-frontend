import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import AnimatedRoutes from "./AnimatedRoutes";

// Simplified component that just renders the main content immediately
const IntroContent = () => {
  return (
    <div className="relative" id="container">
      <main id="main" style={{ backgroundColor: "rgb(17, 24, 39)" }}>
        <Navbar />
        <AnimatedRoutes />
      </main>
    </div>
  );
};

// Wrapper component that provides Router context
const Intro = () => {
  return (
    <BrowserRouter>
      <IntroContent />
    </BrowserRouter>
  );
};

export default Intro;