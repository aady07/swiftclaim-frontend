import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import Intro from "./components/Intro";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import ClaimUpload from "./pages/ClaimUpload";
import ChatbotPage from "./pages/ChatbotPage";
import Navbar from "./components/Navbar";
import Chatbot3D from "./components/Chatbot3D";
import Footer from "./components/Footer";
import APIDocumentation from "./pages/APIDocumentation";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import { SpeedInsights } from "@vercel/speed-insights/react";

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => {
  const location = useLocation();
  const isChatbotPage = location.pathname === "/chatbotpage";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/claimupload" element={<ClaimUpload />} />
          <Route path="/chatbotpage" element={<ChatbotPage />} />
          <Route path="/apidocs" element={<APIDocumentation />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights/>
      {!isChatbotPage && <Chatbot3D />}
    </div>
  );
};

export default App;