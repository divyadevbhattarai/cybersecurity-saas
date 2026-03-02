import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function CaseStudiesPage() {
  const [activeIndustry, setActiveIndustry] = useState("all");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const hexagons = [];
    const hexRadius = 30;
    const cols = Math.ceil(canvas.width / (hexRadius * 3)) + 1;
    const rows = Math.ceil(canvas.height / (hexRadius * 1.73)) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexRadius * 3 + (row % 2) * hexRadius * 1.5;
        const y = row * hexRadius * 1.73;
        hexagons.push({
          x, y,
          baseAlpha: Math.random() * 0.1 + 0.02,
          alpha: Math.random() * 0.1 + 0.02,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    let time = 0;
    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      hexagons.forEach(hex => {
        hex.alpha = hex.baseAlpha + Math.sin(time + hex.phase) * 0.05;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = hex.x + hexRadius * Math.cos(angle);
          const py = hex.y + hexRadius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(79, 70, 229, ${hex.alpha})`;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const industries = [
    { id: "all", label: "All Industries" },
    { id: "finance", label: "Financial Services" },
    { id: "healthcare", label: "Healthcare" },
    { id: "technology", label: "Technology" },
    { id: "retail", label: "Retail & E-commerce" },
  ];

  const caseStudies = [
    {
      id: 1,
      industry: "finance",
      company: "GlobalBank Corp",
      logo: "GB",
      title: "How GlobalBank Reduced Security Incidents by 94% with AI-Powered Threat Detection",
      challenge: "Faced with 10,000+ daily security alerts and a thin SOC team, GlobalBank struggled to identify real threats among false positives.",
      solution: "Deployed CyberShield's AI threat detection with automated triage and prioritized alerting.",
      results: [
        { metric: "94%", label: "Reduction in incidents" },
        { metric: "78%", label: "Faster response time" },
        { metric: "99.9%", label: "Detection accuracy" },
      ],
      quote: "CyberShield transformed our security operations. We're now catching threats that would have slipped through before.",
      author: "James Wilson, CISO",
    },
    {
      id: 2,
      industry: "healthcare",
      company: "MedCare Systems",
      logo: "MC",
      title: "Securing Patient Data Across 500+ Locations with Zero Trust Architecture",
      challenge: "MedCare needed to secure sensitive patient data across hundreds of clinics while maintaining fast access for healthcare workers.",
      solution: "Implemented Zero Trust Network Access with identity-based micro-segmentation.",
      results: [
        { metric: "100%", label: "HIPAA compliance" },
        { metric: "0", label: "Data breaches" },
        { metric: "40%", label: "Faster access" },
      ],
      quote: "Zero Trust has given us complete visibility and control over who accesses patient data, without slowing down our clinicians.",
      author: "Dr. Emily Chen, CIO",
    },
    {
      id: 3,
      industry: "technology",
      company: "CloudTech SaaS",
      logo: "CT",
      title: "Automating DevSecOps: From 2 Weeks to 2 Hours for Security Reviews",
      challenge: "CloudTech's manual security review process was blocking deployments and causing significant delays.",
      solution: "Integrated automated security scanning into CI/CD pipeline with instant vulnerability detection.",
      results: [
        { metric: "96%", label: "Faster reviews" },
        { metric: "2hr", label: "Avg scan time" },
        { metric: "85%", label: "Issues auto-fixed" },
      ],
      quote: "Security no longer slows us down. It's become a competitive advantage that helps us win enterprise deals.",
      author: "Sarah Kim, VP Engineering",
    },
    {
      id: 4,
      industry: "retail",
      company: "ShopMax Retail",
      logo: "SM",
      title: "Protecting 5 Million Customer Records During Peak Holiday Traffic",
      challenge: "ShopMax needed to secure their e-commerce platform during the highest-traffic period of the year.",
      solution: "Deployed comprehensive cloud security with real-time threat monitoring and automated response.",
      results: [
        { metric: "0", label: "Security incidents" },
        { metric: "99.99%", label: "Uptime maintained" },
        { metric: "3x", label: "Threats blocked" },
      ],
      quote: "CyberShield gave us confidence to handle our biggest traffic spike while knowing our customers were protected.",
      author: "Mike Johnson, CTO",
    },
    {
      id: 5,
      industry: "finance",
      company: "InvestSecure",
      logo: "IS",
      title: "Achieving SOC 2 Type II Compliance in 3 Months Flat",
      challenge: "InvestSecure needed to achieve SOC 2 compliance quickly to close a major enterprise deal.",
      solution: "Used automated compliance monitoring with continuous control validation.",
      results: [
        { metric: "3mo", label: "To compliance" },
        { metric: "100%", label: "Audit passed" },
        { metric: "60%", label: "Cost reduction" },
      ],
      quote: "What normally takes 9 months took us 3. The automation made all the difference.",
      author: "Lisa Park, Compliance Officer",
    },
    {
      id: 6,
      industry: "technology",
      company: "DataFlow Inc",
      logo: "DF",
      title: "Stopping a Sophisticated Ransomware Attack Before Damage",
      challenge: "DataFlow detected anomalous behavior that matched advanced persistent threat patterns.",
      solution: "AI-powered anomaly detection with automated isolation and forensic analysis.",
      results: [
        { metric: "<1hr", label: "Threat contained" },
        { metric: "0", label: "Data encrypted" },
        { metric: "$2M", label: "Loss prevented" },
      ],
      quote: "The system identified the threat within minutes. Manual analysis would have taken days.",
      author: "Tom Richards, Security Lead",
    },
  ];

  const filteredStudies = activeIndustry === "all"
    ? caseStudies
    : caseStudies.filter(s => s.industry === activeIndustry);

  return (
    <div className="case-studies-page">
      <canvas ref={canvasRef} className="case-canvas" />

      <Header />

      <section className="case-hero">
        <div className="case-hero-bg">
          <div className="hero-circuit"></div>
        </div>
        <div className="case-hero-content">
          <span className="case-badge">Customer Success Stories</span>
          <h1 className="case-title">
            See How Companies
            <span className="gradient-text"> Trust CyberShield</span>
          </h1>
          <p className="case-subtitle">
            Discover how organizations across industries transformed their security posture with our platform.
          </p>
        </div>
        <div className="case-stats-bar">
          <div className="case-stat-item">
            <span className="stat-value">500+</span>
            <span className="stat-label">Enterprise Customers</span>
          </div>
          <div className="case-stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Customer Satisfaction</span>
          </div>
          <div className="case-stat-item">
            <span className="stat-value">$10B+</span>
            <span className="stat-label">Assets Protected</span>
          </div>
        </div>
      </section>

      <section className="case-industries">
        <div className="industries-container">
          {industries.map(ind => (
            <button
              key={ind.id}
              className={`industry-btn ${activeIndustry === ind.id ? "active" : ""}`}
              onClick={() => setActiveIndustry(ind.id)}
            >
              <span className="btn-glow"></span>
              {ind.label}
            </button>
          ))}
        </div>
      </section>

      <section className="case-studies-section">
        <div className="case-studies-grid">
          {filteredStudies.map((study, index) => (
            <article key={study.id} className="case-card" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="case-card-header">
                <div className="company-logo">
                  <span>{study.logo}</span>
                </div>
                <span className="company-name">{study.company}</span>
              </div>
              <div className="case-card-body">
                <h3>{study.title}</h3>
                <div className="case-sections">
                  <div className="case-section">
                    <h4>Challenge</h4>
                    <p>{study.challenge}</p>
                  </div>
                  <div className="case-section">
                    <h4>Solution</h4>
                    <p>{study.solution}</p>
                  </div>
                </div>
                <div className="case-results">
                  {study.results.map((result, i) => (
                    <div key={i} className="result-item">
                      <span className="result-metric">{result.metric}</span>
                      <span className="result-label">{result.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="case-card-quote">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p>"{study.quote}"</p>
                <span className="quote-author">— {study.author}</span>
              </div>
              <button className="read-case-btn">
                Read Full Story
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="industry-impact-section">
        <div className="industry-impact-container">
          <div className="section-intro" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Industry Impact</span>
            <h2>Trusted by Enterprises Worldwide</h2>
          </div>
          <div className="impact-stats-grid">
            <div className="impact-stat-card">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="impact-number">500+</span>
              <span className="impact-label">Enterprise Customers</span>
            </div>
            <div className="impact-stat-card">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="impact-number">$10B+</span>
              <span className="impact-label">Assets Protected</span>
            </div>
            <div className="impact-stat-card">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="impact-number">99.9%</span>
              <span className="impact-label">Threat Detection Rate</span>
            </div>
            <div className="impact-stat-card">
              <div className="impact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="impact-number">94%</span>
              <span className="impact-label">Incident Reduction</span>
            </div>
          </div>
        </div>
      </section>

      <section className="case-cta">
        <div className="case-cta-container">
          <div className="cta-mockup">
            <div className="mockup-window">
              <div className="window-header">
                <span className="window-dot"></span>
                <span className="window-dot"></span>
                <span className="window-dot"></span>
              </div>
              <div className="window-content">
                <div className="content-lines">
                  <div className="line long"></div>
                  <div className="line medium"></div>
                  <div className="line short"></div>
                </div>
                <div className="content-chart">
                  <div className="chart-bar" style={{ height: '40%' }}></div>
                  <div className="chart-bar" style={{ height: '65%' }}></div>
                  <div className="chart-bar" style={{ height: '55%' }}></div>
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="cta-text">
            <h2>Ready to Write Your Success Story?</h2>
            <p>Join hundreds of companies that have transformed their security with CyberShield.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
              <Link to="/contact" className="btn btn-outline btn-lg">Talk to Sales</Link>
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
                    <linearGradient id="footerLogoGradCase" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2L4 10v12c0 9.94 7.16 17.9 16 20 8.84-2.1 16-10.06 16-20V10L20 2z" fill="url(#footerLogoGradCase)" opacity="0.15" />
                  <path d="M20 4.5L7 11.5v10c0 7.95 5.77 14.32 13 16 7.23-1.68 13-8.05 13-16v-10L20 4.5z" stroke="url(#footerLogoGradCase)" strokeWidth="2" fill="none" />
                  <path d="M20 12v12M12 16l8 4 8-4" stroke="url(#footerLogoGradCase)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="18" r="3" fill="url(#footerLogoGradCase)" />
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

export default CaseStudiesPage;
