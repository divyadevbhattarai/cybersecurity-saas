import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieConsent from "./components/CookieConsent";
import { ToastProvider } from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import IncidentList from "./pages/IncidentList";
import SecurityTraining from "./pages/SecurityTraining";
import ZTNA from "./pages/ZTNA";
import SOAR from "./pages/SOAR";
import SBOM from "./pages/SBOM";
import RASP from "./pages/RASP";
import Deception from "./pages/Deception";
import Audit from "./pages/Audit";
import QuantumCrypto from "./pages/QuantumCrypto";
import ConfidentialComputing from "./pages/ConfidentialComputing";
import PrivacyML from "./pages/PrivacyML";
import Compliance from "./pages/Compliance";
import ZTNAPage from "./pages/ZTNAPage";
import SOARPage from "./pages/SOARPage";
import SBOMPage from "./pages/SBOMPage";
import RASPPage from "./pages/RASPPage";
import CloudSecurityPage from "./pages/CloudSecurityPage";
import ThreatDetectionPage from "./pages/ThreatDetectionPage";
import IncidentResponsePage from "./pages/IncidentResponsePage";
import CompliancePage from "./pages/CompliancePage";
import DocumentationPage from "./pages/DocumentationPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import WebinarsPage from "./pages/WebinarsPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const hasAuthCookie = () => {
  return document.cookie.split(';').some(c => c.trim().startsWith('access_token='));
};

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cookieToken = hasAuthCookie();

  if (!isAuthenticated && !cookieToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cookieToken = hasAuthCookie();
  const isLoggedIn = isAuthenticated || cookieToken;

  const handleSkipToContent = (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
      <div className="App">
        <ErrorBoundary>
          <a 
            href="#main-content" 
            className="skip-to-content"
            onClick={handleSkipToContent}
          >
            Skip to main content
          </a>
          <CookieConsent />
          <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/landing" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/incidents"
            element={
              <PrivateRoute>
                <IncidentList />
              </PrivateRoute>
            }
          />
          <Route
            path="/training"
            element={
              <PrivateRoute>
                <SecurityTraining />
              </PrivateRoute>
            }
          />
          <Route
            path="/ztna"
            element={
              <PrivateRoute>
                <ZTNA />
              </PrivateRoute>
            }
          />
          <Route
            path="/soar"
            element={
              <PrivateRoute>
                <SOAR />
              </PrivateRoute>
            }
          />
          <Route
            path="/sbom"
            element={
              <PrivateRoute>
                <SBOM />
              </PrivateRoute>
            }
          />
          <Route
            path="/rasp"
            element={
              <PrivateRoute>
                <RASP />
              </PrivateRoute>
            }
          />
          <Route
            path="/deception"
            element={
              <PrivateRoute>
                <Deception />
              </PrivateRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <PrivateRoute>
                <Audit />
              </PrivateRoute>
            }
          />
          <Route
            path="/quantum-crypto"
            element={
              <PrivateRoute>
                <QuantumCrypto />
              </PrivateRoute>
            }
          />
          <Route
            path="/confidential-computing"
            element={
              <PrivateRoute>
                <ConfidentialComputing />
              </PrivateRoute>
            }
          />
          <Route
            path="/privacy-ml"
            element={
              <PrivateRoute>
                <PrivacyML />
              </PrivateRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <PrivateRoute>
                <Compliance />
              </PrivateRoute>
            }
          />
          <Route path="/ztna-page" element={<ZTNAPage />} />
          <Route path="/soar-page" element={<SOARPage />} />
          <Route path="/sbom-page" element={<SBOMPage />} />
          <Route path="/rasp-page" element={<RASPPage />} />
          <Route path="/cloud-security" element={<CloudSecurityPage />} />
          <Route path="/threat-detection" element={<ThreatDetectionPage />} />
          <Route path="/incident-response" element={<IncidentResponsePage />} />
          <Route path="/compliance-page" element={<CompliancePage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/webinars" element={<WebinarsPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
