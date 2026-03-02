import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <Header />
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: March 2026</p>

        <section>
          <h2>Introduction</h2>
          <p>
            At CyberShield, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our cybersecurity SaaS platform.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Use our platform services</li>
            <li>Contact our support team</li>
            <li>Subscribe to our newsletter</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, and events</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@cybershield.com">privacy@cybershield.com</a>
          </p>
        </section>

        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
