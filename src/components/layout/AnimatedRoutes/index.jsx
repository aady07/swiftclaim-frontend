import { Route, Routes, useLocation } from "react-router-dom";
import Services from "../../../pages/Services";
import Home from "../../../pages/Home";
import ClaimUpload from "../../../pages/ClaimUpload";
import AboutUs from "../../../pages/AboutUs";
import Contacts from "../../../pages/Contacts";
import RecognitionUPAward from "../../../pages/RecognitionUPAward";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedRoutes = () => {
      const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/claim-upload" element={<ClaimUpload />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/recognitions/miraista-up-award" element={<RecognitionUPAward />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
