import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function ProductPage({ 
  title, 
  subtitle, 
  overview, 
  capabilities, 
  useCases, 
  architecture, 
  benefits,
  icon,
  gradient
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [navFixed, setNavFixed] = useState(false);
  const navRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && navRef.current) {
        const heroBottom = heroRef.current.offsetHeight;
        setNavFixed(window.scrollY > heroBottom - 80);
      }
      
      const sections = ["overview", "capabilities", "use-cases", "architecture", "benefits"];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = navFixed ? 80 : 140;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "capabilities", label: "Key Capabilities" },
    { id: "use-cases", label: "Use Cases" },
    { id: "architecture", label: "Architecture" },
    { id: "benefits", label: "Benefits" },
  ];

  return (
    <div className="product-page">
      <Header />

      <section ref={heroRef} className="product-hero" style={{ "--gradient": gradient }}>
        <div className="product-hero-bg">
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{ '--i': i }}></div>
            ))}
          </div>
          <div className="product-glow"></div>
          <div className="grid-pattern"></div>
        </div>
        <div className="product-hero-content">
          <div className="hero-badges">
            <span className="product-badge">
              <span className="badge-dot"></span>
              Enterprise Security
            </span>
          </div>
          <h1 className="product-hero-title">{title}</h1>
          <p className="product-hero-subtitle">{subtitle}</p>
          <div className="product-hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
            <Link to="/contact" className="btn btn-outline btn-lg">Contact Sales</Link>
          </div>
        </div>
        <div className="product-hero-visual">
          <div className="ai-illustration-3d">
            <div className="illustration-container">
              <div className="core-sphere">
                <div className="sphere-inner"></div>
                <div className="sphere-glow"></div>
              </div>
              <div className="orbital-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
              <div className="floating-nodes">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="node" style={{ '--i': i }}></div>
                ))}
              </div>
              <div className="data-streams">
                <div className="stream stream-1"></div>
                <div className="stream stream-2"></div>
                <div className="stream stream-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav ref={navRef} className={`product-nav ${navFixed ? "fixed" : ""}`}>
        <div className="product-nav-container">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`product-nav-item ${activeSection === section.id ? "active" : ""}`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label}
              {activeSection === section.id && <span className="nav-indicator"></span>}
            </button>
          ))}
        </div>
      </nav>

      <section id="overview" className="product-section">
        <div className="section-background">
          <div className="bg-gradient"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Overview</span>
            <h2>What is {title}?</h2>
          </div>
          <div className="overview-content">
            <div className="overview-visual">
              <div className="overview-3d-card">
                <div className="card-face card-front">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d={icon} />
                  </svg>
                </div>
                <div className="card-face card-back"></div>
                <div className="card-shadow"></div>
              </div>
            </div>
            <div className="overview-text">
              <p>{overview}</p>
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">SOC2</span>
                  <span className="stat-label">Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="product-section">
        <div className="section-background">
          <div className="bg-grid"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Key Capabilities</span>
            <h2>Powerful Features for Complete Protection</h2>
          </div>
          <div className="capabilities-grid">
            {capabilities.map((cap, index) => (
              <div 
                key={index} 
                className="capability-card-3d" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-inner">
                  <div className="capability-icon-3d" style={{ background: `${cap.color}15` }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={cap.color} strokeWidth="2">
                      <path d={cap.icon} />
                    </svg>
                    <div className="icon-glow" style={{ background: cap.color }}></div>
                  </div>
                  <h3>{cap.title}</h3>
                  <p>{cap.description}</p>
                  <div className="card-border-glow" style={{ '--glow-color': cap.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="product-section">
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Use Cases</span>
            <h2>Solving Real-World Security Challenges</h2>
          </div>
          <div className="use-cases-grid">
            {useCases.map((useCase, index) => (
              <div key={index} className="use-case-card-3d">
                <div className="use-case-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="use-case-content">
                  <h3>{useCase.title}</h3>
                  <p>{useCase.description}</p>
                </div>
                <div className="use-case-visual">
                  <div className="visual-circle"></div>
                  <div className="visual-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="product-section">
        <div className="section-background">
          <div className="bg-diagram"></div>
        </div>
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Architecture</span>
            <h2>How It Works</h2>
            <p className="architecture-intro">{architecture.description}</p>
          </div>
          <div className="architecture-diagram-3d">
            <svg viewBox="0 0 800 400" fill="none" className="architecture-svg">
              <defs>
                <linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
                <filter id="archGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {architecture.diagram}
            </svg>
          </div>
        </div>
      </section>

      <section id="benefits" className="product-section">
        <div className="product-section-container">
          <div className="section-intro">
            <span className="section-label">Benefits</span>
            <h2>Measurable Business Impact</h2>
          </div>
          <div className="benefits-grid-3d">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card-3d" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="benefit-visual">
                  <div className="benefit-ring"></div>
                  <span className="benefit-value">{benefit.value}</span>
                </div>
                <h3>{benefit.label}</h3>
                <p>{benefit.description}</p>
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
          <div className="cta-visual">
            <div className="cta-3d-element">
              <div className="shield-3d">
                <div className="shield-face shield-front">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="cta-content">
            <h2>Ready to secure your infrastructure?</h2>
            <p>Start your free 14-day trial. No credit card required.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Schedule Demo</Link>
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
                    <linearGradient id="footerLogoGradPage" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradPage)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradPage)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradPage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradPage)" />
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

export default ProductPage;
