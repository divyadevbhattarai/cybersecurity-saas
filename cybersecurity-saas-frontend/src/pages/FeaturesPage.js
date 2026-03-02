import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function FeaturesPage() {
  const features = [
    {
      id: "cloud-security",
      title: "Cloud Security Audits",
      description: "Automated comprehensive checks for S3 bucket permissions, IAM roles, KMS encryption, and CloudTrail logging status across your AWS infrastructure.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "#ef4444",
      benefits: ["Automated compliance checks", "Real-time misconfiguration alerts", "Detailed remediation guidance"]
    },
    {
      id: "ai-threat",
      title: "AI Threat Detection",
      description: "Machine learning-powered anomaly detection using Isolation Forest algorithms to identify unusual login patterns and suspicious activities in real-time.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "#f87171",
      benefits: ["99.9% detection accuracy", "Real-time threat blocking", "Adaptive learning"]
    },
    {
      id: "monitoring",
      title: "Real-Time Monitoring",
      description: "Instant alerts via WebSocket connections for immediate threat response, with live dashboard updates and incident management.",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      color: "#fca5a5",
      benefits: ["24/7 live monitoring", "Instant alerts", "Live dashboard"]
    },
    {
      id: "incident",
      title: "Incident Management",
      description: "Track, manage, and resolve security incidents with comprehensive logging, status tracking, and automated response workflows.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      color: "#dc2626",
      benefits: ["Automated response", "Full audit trail", "Team collaboration"]
    },
    {
      id: "aws-integration",
      title: "AWS Integration",
      description: "Seamless integration with AWS services including S3, IAM, KMS, and CloudTrail for comprehensive cloud security posture management.",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      color: "#b91c1c",
      benefits: ["Native AWS integration", "Multi-account support", "Automatic discovery"]
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Powerful analytics dashboard with detailed security metrics, trend analysis, and customizable reporting for executive summaries.",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      color: "#7f1d1d",
      benefits: ["Custom reports", "Trend analysis", "Executive dashboards"]
    }
  ];

  return (
    <div className="product-page">
      <Header />

      <section className="product-hero" style={{ "--gradient": "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" }}>
        <div className="product-hero-bg">
          <div className="product-grid-pattern"></div>
          <div className="hero-particles">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="particle" style={{ '--i': i }}></div>
            ))}
          </div>
        </div>
        <div className="product-hero-content" style={{ textAlign: "center", maxWidth: "900px" }}>
          <div className="hero-badges" style={{ justifyContent: "center" }}>
            <span className="product-badge">
              <span className="badge-dot"></span>
              Platform Features
            </span>
          </div>
          <h1 className="product-hero-title">Enterprise-Grade Security Features</h1>
          <p className="product-hero-subtitle">
            Comprehensive security tools designed to protect your cloud infrastructure from modern threats. 
            Everything you need in one platform.
          </p>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="features-list">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-list-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="feature-list-icon" style={{ background: `${feature.color}15` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={feature.color} strokeWidth="2">
                    <path d={feature.icon} />
                  </svg>
                </div>
                <div className="feature-list-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <ul className="feature-benefits">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i}>
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn-outline">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-grid"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Why Choose Us</span>
            <h2>Built for Modern Security Teams</h2>
          </div>
          <div className="capabilities-grid">
            <div className="capability-card-3d">
              <div className="card-inner">
                <div className="capability-icon-3d" style={{ background: '#ef444415' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div className="icon-glow" style={{ background: '#ef4444' }}></div>
                </div>
                <h3>Lightning Fast</h3>
                <p>Deploy in minutes with our cloud-native architecture designed for speed and scalability.</p>
                <div className="card-border-glow" style={{ '--glow-color': '#ef4444' }}></div>
              </div>
            </div>
            <div className="capability-card-3d">
              <div className="card-inner">
                <div className="capability-icon-3d" style={{ background: '#f8717115' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="icon-glow" style={{ background: '#f87171' }}></div>
                </div>
                <h3>Enterprise Security</h3>
                <p>SOC 2 Type II certified with end-to-end encryption and compliance with major standards.</p>
                <div className="card-border-glow" style={{ '--glow-color': '#f87171' }}></div>
              </div>
            </div>
            <div className="capability-card-3d">
              <div className="card-inner">
                <div className="capability-icon-3d" style={{ background: '#fca5a515' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="icon-glow" style={{ background: '#fca5a5' }}></div>
                </div>
                <h3>Cost Effective</h3>
                <p>Pay only for what you need with transparent pricing and no hidden fees.</p>
                <div className="card-border-glow" style={{ '--glow-color': '#fca5a5' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="cta-3d-bg">
          <div className="cta-particles"></div>
        </div>
        <div className="product-cta-container">
          <div className="cta-content">
            <h2>Ready to Secure Your Infrastructure?</h2>
            <p>Start your free 14-day trial today. No credit card required.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
              <Link to="/pricing" className="btn btn-outline btn-lg">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
                  <defs>
                    <linearGradient id="footerLogoGradFeatures" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradFeatures)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradFeatures)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradFeatures)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradFeatures)" />
                </svg>
                <span>CyberShield</span>
              </Link>
              <p className="footer-tagline">Enterprise-grade cybersecurity for the modern cloud.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CyberShield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FeaturesPage;
