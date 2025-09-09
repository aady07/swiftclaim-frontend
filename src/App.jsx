import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import Intro from "./components/Intro";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import ClaimUpload from "./pages/ClaimUpload";
import ChatbotPage from "./pages/ChatbotPage";
import ChatbotIframePage from "./pages/ChatbotIframePage";
import Navbar from "./components/common/Navbar";
import Chatbot3D from "./components/chatbot/Chatbot3D";
import Footer from "./components/common/Footer";
import APIDocumentation from "./pages/APIDocumentation";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Widget from "./pages/Widget";

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
  const isChatbotIframe = location.pathname === "/chatbot-iframe";
  const isWidget = location.pathname === "/widget";
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isChatbotIframe && !isWidget && <Navbar />}
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/claimupload" element={<ClaimUpload />} />
          <Route path="/chatbotpage" element={<ChatbotPage />} />
          <Route path="/chatbot-iframe" element={<ChatbotIframePage />} />
          <Route path="/apidocs" element={<APIDocumentation />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/widget" element={<Widget />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isChatbotIframe && !isWidget && <Footer />}
      <Analytics />
      <SpeedInsights/>
      {!isChatbotPage && !isChatbotIframe && !isWidget && <Chatbot3D />}
    </div>
  );
};

export default App;