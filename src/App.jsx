import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClaimUpload from "./pages/ClaimUpload";
import ClaimsDashboard from "./pages/ClaimsDashboard";
import Contacts from "./pages/Contacts";
import { useCognitoAuth } from './hooks/useCognitoAuth';

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const { user } = useCognitoAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          {/* Auto-redirect root: if logged in, go to claimupload, else login */}
          <Route path="/" element={user ? <Navigate to="/imageupload" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/imageupload" element={<ProtectedRoute><ClaimUpload /></ProtectedRoute>} />
          <Route path="/assessments-dashboard" element={<ProtectedRoute><ClaimsDashboard /></ProtectedRoute>} />
          <Route path="/contacts" element={<Contacts />} />
          {/* Fallback: redirect all other routes to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
};

export default App;