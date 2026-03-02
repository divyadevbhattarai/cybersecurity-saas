import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function AboutPage() {
  const timeline = [
    { year: "2019", title: "Founded", description: "CyberShield was founded with a mission to democratize enterprise security" },
    { year: "2020", title: "Seed Funding", description: "Raised $10M in seed funding to build our AI-powered security platform" },
    { year: "2021", title: "Product Launch", description: "Launched our first ZTNA product to the market" },
    { year: "2022", title: "Series B", description: "Secured $50M in Series B funding" },
    { year: "2023", title: "500+ Customers", description: "Reached 500+ enterprise customers worldwide" },
    { year: "2024", title: "Global Expansion", description: "Opened offices in Europe and Asia Pacific" },
  ];

  const leadership = [
    { name: "Sarah Chen", role: "CEO & Co-Founder", bio: "Former CISO at Fortune 500 company with 20+ years in cybersecurity" },
    { name: "Michael Torres", role: "CTO & Co-Founder", bio: "Ex-Google security engineer, PhD in Machine Learning" },
    { name: "Jennifer Williams", role: "COO", bio: "Former VP of Operations at Palo Alto Networks" },
    { name: "David Park", role: "CFO", bio: "Investment banking background, former partner at Goldman Sachs" },
  ];

  const values = [
    { 
      title: "Innovation", 
      description: "We continuously push the boundaries of what's possible in cybersecurity, pioneering new approaches to threat detection and prevention.",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      color: "#ef4444"
    },
    { 
      title: "Integrity", 
      description: "We build trust through transparency, honesty, and ethical practices. Security is about protecting what matters most.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "#f87171"
    },
    { 
      title: "Excellence", 
      description: "We strive for the highest quality in everything we do, from code quality to customer support.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "#fca5a5"
    },
    { 
      title: "Customer Focus", 
      description: "Our customers' security is our top priority. We listen, learn, and adapt to their evolving needs.",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      color: "#dc2626"
    },
  ];

  const stats = [
    { value: "500+", label: "Enterprise Customers" },
    { value: "10M+", label: "Threats Blocked Daily" },
    { value: "99.9%", label: "Detection Accuracy" },
    { value: "24/7", label: "Security Monitoring" },
    { value: "50+", label: "Countries Protected" },
    { value: "$10B+", label: "Assets Secured" },
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
              About CyberShield
            </span>
          </div>
          <h1 className="product-hero-title">Securing the Future of Enterprise Security</h1>
          <p className="product-hero-subtitle">
            We believe cybersecurity should be intelligent, proactive, and accessible to organizations of all sizes. 
            Our mission is to democratize enterprise-grade security with AI-powered solutions.
          </p>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Impact</span>
            <h2>Protecting Organizations Worldwide</h2>
          </div>
          <div className="stats-grid-advanced">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card-advanced" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="stat-value-advanced">{stat.value}</div>
                <div className="stat-label-advanced">{stat.label}</div>
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
            <span className="section-label">Our Mission</span>
            <h2>Why We Exist</h2>
          </div>
          <div className="mission-content">
            <div className="mission-visual">
              <div className="mission-illustration">
                <svg viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="80" stroke="#ef4444" strokeWidth="2" opacity="0.3" />
                  <circle cx="100" cy="100" r="60" stroke="#ef4444" strokeWidth="2" opacity="0.5" />
                  <circle cx="100" cy="100" r="40" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
                  <circle cx="100" cy="100" r="20" fill="#ef4444" />
                  <path d="M100 20 L100 40" stroke="#f87171" strokeWidth="2" />
                  <path d="M100 160 L100 180" stroke="#f87171" strokeWidth="2" />
                  <path d="M20 100 L40 100" stroke="#f87171" strokeWidth="2" />
                  <path d="M160 100 L180 100" stroke="#f87171" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="mission-text">
              <p>
                In an era where cyber threats are evolving faster than ever, organizations need security solutions 
                that can keep pace. Traditional security approaches are no longer sufficient against sophisticated 
                AI-powered attacks.
              </p>
              <p>
                CyberShield was founded to address this challenge. We leverage cutting-edge artificial intelligence 
                and machine learning to provide proactive threat detection and automated response capabilities 
                that scale with your organization.
              </p>
              <p>
                Our platform is designed to be intuitive yet powerful, making enterprise-grade security accessible 
                to organizations of all sizes without requiring a army of security experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Our Values</span>
            <h2>What Drives Us</h2>
          </div>
          <div className="capabilities-grid">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="capability-card-3d" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-inner">
                  <div className="capability-icon-3d" style={{ background: `${value.color}15` }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={value.color} strokeWidth="2">
                      <path d={value.icon} />
                    </svg>
                    <div className="icon-glow" style={{ background: value.color }}></div>
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                  <div className="card-border-glow" style={{ '--glow-color': value.color }}></div>
                </div>
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
            <span className="section-label">Our Journey</span>
            <h2>Milestones That Define Us</h2>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={index} className="timeline-item" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Leadership</span>
            <h2>Meet Our Team</h2>
          </div>
          <div className="leadership-grid">
            {leadership.map((leader, index) => (
              <div key={index} className="leader-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="leader-avatar">
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3>{leader.name}</h3>
                <span className="leader-role">{leader.role}</span>
                <p>{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="cta-3d-bg">
          <div className="cta-particles"></div>
        </div>
        <div className="product-cta-container">
          <div className="cta-content">
            <h2>Join Our Mission</h2>
            <p>Help us shape the future of cybersecurity. We're always looking for talented individuals to join our team.</p>
            <div className="cta-actions">
              <Link to="/careers" className="btn btn-primary btn-lg">View Open Positions</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
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
                    <linearGradient id="footerLogoGradAbout" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradAbout)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradAbout)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradAbout)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradAbout)" />
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

export default AboutPage;
