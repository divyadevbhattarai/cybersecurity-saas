import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";

function PartnersPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const partners = [
    { name: "AWS", tier: "Technology Partner" },
    { name: "Microsoft Azure", tier: "Technology Partner" },
    { name: "Google Cloud", tier: "Technology Partner" },
    { name: "Snowflake", tier: "Integration Partner" },
    { name: "Splunk", tier: "Integration Partner" },
    { name: "CrowdStrike", tier: "Integration Partner" },
  ];

  return (
    <div className="product-page">
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="logoGradPart" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
              <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#logoGradPart)" opacity="0.15" />
              <circle cx="20" cy="18" r="3" fill="url(#logoGradPart)" />
            </svg>
            <span className="logo-text">Cyber<span className="logo-accent">Shield</span></span>
          </Link>
          <div className="navbar-auth">
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="product-hero" style={{ "--gradient": "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" }}>
        <div className="product-hero-bg">
          <div className="product-grid-pattern"></div>
        </div>
        <div className="product-hero-content" style={{ textAlign: "center", maxWidth: "800px" }}>
          <h1 className="product-hero-title">Partner Program</h1>
          <p className="product-hero-subtitle">Join our ecosystem of security partners</p>
        </div>
      </section>

      <section className="product-section">
        <div className="product-section-container">
          <div className="product-section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem" }}>Our Partners</h2>
          </div>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="partner-card">
                <h3>{partner.name}</h3>
                <p>{partner.tier}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>&copy; 2026 CyberShield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PartnersPage;
