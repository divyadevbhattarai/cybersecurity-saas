import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function TermsOfService() {
  return (
    <div className="legal-page">
      <Header />
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: March 2026</p>

        <section>
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using CyberShield's services, you accept and agree to be bound 
            by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2>Description of Service</h2>
          <p>
            CyberShield provides cloud security auditing, threat detection, and security 
            monitoring services. The service includes automated security scans, real-time 
            alerting, and comprehensive security reporting.
          </p>
        </section>

        <section>
          <h2>User Responsibilities</h2>
          <p>Users agree to:</p>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of their account credentials</li>
            <li>Use the service in compliance with all applicable laws</li>
            <li>Not attempt to gain unauthorized access to any part of the system</li>
            <li>Not interfere with or disrupt the service</li>
          </ul>
        </section>

        <section>
          <h2>Intellectual Property</h2>
          <p>
            The CyberShield platform, including all content, features, and functionality, 
            is owned by CyberShield and is protected by copyright, trademark, and other 
            intellectual property laws.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            CyberShield shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages resulting from your use of or inability 
            to use the service.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We may terminate or suspend your access to the service immediately, without 
            prior notice or liability, for any reason whatsoever, including breach of 
            these Terms.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@cybershield.com">legal@cybershield.com</a>
          </p>
        </section>

        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    </div>
  );
}

export default TermsOfService;
