import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function Landing() {
  const [visibleSections, setVisibleSections] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.reveal-section');
      const newVisible = {};
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          newVisible[section.id] = true;
        }
      });
      setVisibleSections(newVisible);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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

  const footerLinks = {
    Product: [
      { label: "ZTNA", path: "/ztna-page" },
      { label: "SOAR", path: "/soar-page" },
      { label: "RASP", path: "/rasp-page" },
      { label: "SBOM", path: "/sbom-page" },
    ],
    Platform: [
      { label: "Cloud Security", path: "/cloud-security" },
      { label: "Threat Detection", path: "/threat-detection" },
      { label: "Incident Response", path: "/incident-response" },
      { label: "Compliance", path: "/compliance-page" },
    ],
    Company: [
      { label: "About", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Contact", path: "/contact" },
    ],
    Resources: [
      { label: "Documentation", path: "/documentation" },
      { label: "Blog", path: "/blog" },
      { label: "Webinars", path: "/webinars" },
      { label: "Case Studies", path: "/case-studies" },
    ],
    Legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Cookie Policy", path: "/cookie-policy" },
      { label: "GDPR", path: "/gdpr" },
    ],
  };

  return (
    <div className="landing-page">
      <Header />

      {/* Hero Section */}
      <section className="hero" id="main-content" tabIndex="-1">
        <div className="hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
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
        <div className="hero-image-container">
          <div className="hero-dashboard-preview">
            <div className="dashboard-header">
              <div className="dashboard-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="dashboard-title">CyberShield Dashboard</span>
            </div>
            <div className="dashboard-content">
              <div className="dashboard-chart">
                <div className="chart-header">
                  <span>Threat Detection</span>
                  <span className="chart-badge">+12%</span>
                </div>
                <div className="chart-bars">
                  <div className="bar" style={{height: '40%'}}></div>
                  <div className="bar" style={{height: '65%'}}></div>
                  <div className="bar" style={{height: '45%'}}></div>
                  <div className="bar" style={{height: '80%'}}></div>
                  <div className="bar" style={{height: '55%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
                  <div className="bar" style={{height: '70%'}}></div>
                </div>
              </div>
              <div className="dashboard-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">99.9%</span>
                  <span className="mini-stat-label">Uptime</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">24/7</span>
                  <span className="mini-stat-label">Monitoring</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">50+</span>
                  <span className="mini-stat-label">Integrations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`features reveal-section ${visibleSections['features'] ? 'revealed' : ''}`} style={{'--mouse-x': `${mousePosition.x}%`, '--mouse-y': `${mousePosition.y}%`}}>
        <div className="section-container">
          <div className="section-header reveal-item">
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
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  '--index': index 
                }}
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
      <section className={`stats-section reveal-section ${visibleSections['stats'] ? 'revealed' : ''}`}>
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
      <section className={`how-it-works reveal-section ${visibleSections['how-it-works'] ? 'revealed' : ''}`}>
        <div className="section-container">
          <div className="section-header reveal-item">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">
              Security in
              <span className="gradient-text"> Three Steps</span>
            </h2>
          </div>
          <div className="steps-container">
            <div className="step reveal-item" style={{'--delay': '0s'}}>
              <div className="step-visual">
                <div className="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="step-pulse"></div>
              </div>
              <div className="step-number">01</div>
              <h3 className="step-title">Connect Your Cloud</h3>
              <p className="step-description">
                Link your AWS account securely. We use read-only access to
                analyze your infrastructure.
              </p>
            </div>
            <div className="step-connector">
              <div className="connector-line"></div>
            </div>
            <div className="step reveal-item" style={{'--delay': '0.15s'}}>
              <div className="step-visual">
                <div className="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="step-pulse"></div>
              </div>
              <div className="step-number">02</div>
              <h3 className="step-title">Automated Scanning</h3>
              <p className="step-description">
                Our AI continuously monitors for vulnerabilities, misconfigurations,
                and suspicious activities.
              </p>
            </div>
            <div className="step-connector">
              <div className="connector-line"></div>
            </div>
            <div className="step reveal-item" style={{'--delay': '0.3s'}}>
              <div className="step-visual">
                <div className="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div className="step-pulse"></div>
              </div>
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
      <section className={`testimonials reveal-section ${visibleSections['testimonials'] ? 'revealed' : ''}`}>
        <div className="section-container">
          <div className="section-header reveal-item">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">
              Trusted by Security
              <span className="gradient-text"> Leaders</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index} style={{'--index': index}}>
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
      <section className={`cta-section reveal-section ${visibleSections['cta'] ? 'revealed' : ''}`}>
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
                <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
                  <defs>
                    <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z"
                    fill="url(#footerLogoGrad)"
                    opacity="0.15"
                  />
                  <path
                    d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z"
                    stroke="url(#footerLogoGrad)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M20 12v12M12 16l8 4 8-4"
                    stroke="url(#footerLogoGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGrad)" />
                </svg>
                <span>CyberShield</span>
              </Link>
              <p className="footer-tagline">
                Enterprise-grade cybersecurity for the modern cloud. Protect your
                infrastructure with AI-powered security.
              </p>
              <div className="footer-social">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                {footerLinks.Product.map((link, i) => (
                  <a key={i} href={link.path}>{link.label}</a>
                ))}
              </div>
              <div className="footer-column">
                <h4>Platform</h4>
                {footerLinks.Platform.map((link, i) => (
                  <a key={i} href={link.path}>{link.label}</a>
                ))}
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                {footerLinks.Company.map((link, i) => (
                  <a key={i} href={link.path}>{link.label}</a>
                ))}
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                {footerLinks.Resources.map((link, i) => (
                  <a key={i} href={link.path}>{link.label}</a>
                ))}
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                {footerLinks.Legal.map((link, i) => (
                  <Link key={i} to={link.path}>{link.label}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>&copy; 2026 CyberShield. All rights reserved.</p>
              <p className="footer-location">San Francisco, CA</p>
            </div>
            <div className="footer-badges">
              <div className="footer-badge-compliance">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>SOC 2 Type II</span>
              </div>
              <div className="footer-badge-compliance">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>ISO 27001</span>
              </div>
              <div className="footer-badge-compliance">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>GDPR Compliant</span>
              </div>
            </div>>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
