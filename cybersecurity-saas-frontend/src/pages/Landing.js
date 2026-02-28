import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";

function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Cloud Security Audits",
      description:
        "Automated comprehensive checks for S3 bucket permissions, IAM roles, KMS encryption, and CloudTrail logging status across your AWS infrastructure.",
      color: "#4f46e5",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "AI Threat Detection",
      description:
        "Machine learning-powered anomaly detection using Isolation Forest algorithms to identify unusual login patterns and suspicious activities in real-time.",
      color: "#06b6d4",
    },
    {
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      title: "Real-Time Monitoring",
      description:
        "Instant alerts via WebSocket connections for immediate threat response, with live dashboard updates and incident management.",
      color: "#10b981",
    },
    {
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      title: "Incident Management",
      description:
        "Track, manage, and resolve security incidents with comprehensive logging, status tracking, and automated response workflows.",
      color: "#f59e0b",
    },
    {
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      title: "AWS Integration",
      description:
        "Seamless integration with AWS services including S3, IAM, KMS, and CloudTrail for comprehensive cloud security posture management.",
      color: "#ef4444",
    },
    {
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      title: "Advanced Analytics",
      description:
        "Powerful analytics dashboard with detailed security metrics, trend analysis, and customizable reporting for executive summaries.",
      color: "#8b5cf6",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime SLA" },
    { value: "50+", label: "Security Checks" },
    { value: "24/7", label: "Monitoring" },
    { value: "AI-Powered", label: "Detection" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CISO, TechCorp",
      content:
        "CyberShield transformed our security posture. The AI-driven detection caught threats we would have missed.",
      avatar: "SC",
    },
    {
      name: "Michael Roberts",
      role: "VP Engineering, CloudFirst",
      content:
        "The automated cloud audits saved us countless hours. Now we have complete visibility into our AWS environment.",
      avatar: "MR",
    },
    {
      name: "Emily Watson",
      role: "Security Lead, DataSecure",
      content:
        "Real-time alerts and incident management have reduced our response time by 70%. Highly recommended.",
      avatar: "EW",
    },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>CyberShield</span>
          </Link>
          <div className="navbar-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </div>
          <div className="navbar-auth">
            <Link to="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Security Platform
          </div>
          <h1 className="hero-title">
            Protect Your Cloud with
            <span className="gradient-text"> Intelligent Security</span>
          </h1>
          <p className="hero-description">
            Comprehensive cybersecurity platform with real-time threat monitoring,
            automated cloud security audits, and AI-driven anomaly detection.
            Secure your infrastructure in minutes.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free Trial
              <svg
                className="btn-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              View Demo
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">500+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-value">10M+</span>
              <span className="stat-label">Threats Blocked</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">
              Enterprise-Grade Security
              <span className="gradient-text"> Made Simple</span>
            </h2>
            <p className="section-description">
              Everything you need to secure your cloud infrastructure. From
              automated audits to AI-powered threat detection.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                className="feature-card"
                key={index}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="feature-icon-wrapper"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <svg
                    className="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={feature.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={feature.icon} />
                  </svg>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <Link to="/register" className="feature-link">
                  Learn more
                  <svg
                    className="link-arrow"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-bg"></div>
        <div className="section-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-item" key={index}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">
              Security in
              <span className="gradient-text"> Three Steps</span>
            </h2>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <h3 className="step-title">Connect Your Cloud</h3>
              <p className="step-description">
                Link your AWS account securely. We use read-only access to
                analyze your infrastructure.
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">02</div>
              <h3 className="step-title">Automated Scanning</h3>
              <p className="step-description">
                Our AI continuously monitors for vulnerabilities, misconfigurations,
                and suspicious activities.
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">03</div>
              <h3 className="step-title">Instant Protection</h3>
              <p className="step-description">
                Receive real-time alerts and actionable recommendations to fix
                security issues immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">
              Trusted by Security
              <span className="gradient-text"> Leaders</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-content">
                  <svg
                    className="quote-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p>{testimonial.content}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Secure Your Cloud?
            </h2>
            <p className="cta-description">
              Join thousands of organizations protecting their infrastructure
              with CyberShield. Start your free 14-day trial today.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <span className="cta-note">No credit card required</span>
            </div>
          </div>
          <div className="cta-visual">
            <div className="cta-card">
              <div className="cta-card-header">
                <div className="cta-card-dot"></div>
                <div className="cta-card-dot"></div>
                <div className="cta-card-dot"></div>
              </div>
              <div className="cta-card-body">
                <div className="cta-mock-security">
                  <div className="mock-threat blocked">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>S3 Bucket Vulnerability</span>
                    <span className="status">Blocked</span>
                  </div>
                  <div className="mock-threat blocked">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>IAM Policy Change</span>
                    <span className="status">Blocked</span>
                  </div>
                  <div className="mock-threat blocked">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Unusual Login Pattern</span>
                    <span className="status">Alerted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <svg
                  className="logo-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>CyberShield</span>
              </Link>
              <p className="footer-tagline">
                Enterprise-grade cybersecurity for the modern cloud. Protect your
                infrastructure with AI-powered security.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#security">Security</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#contact">Contact</a>
                <a href="#status">Status</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CyberShield. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
