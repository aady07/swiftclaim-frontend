import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Intro from "./components/Intro";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Navbar from "./components/Navbar"; 

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
      <Analytics />
    </>
  );
};

export default App;
