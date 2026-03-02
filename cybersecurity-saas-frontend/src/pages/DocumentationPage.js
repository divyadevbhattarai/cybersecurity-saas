import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../index.css";

function DocumentationPage() {
  const categories = [
    {
      name: "Getting Started",
      description: "Begin your journey with CyberShield",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "#ef4444",
      articles: ["Quick Start Guide", "Account Setup", "First Deployment", "Basic Configuration"]
    },
    {
      name: "Core Concepts",
      description: "Understand the fundamentals",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "#f87171",
      articles: ["Security Architecture", "Zero Trust Model", "Deployment Patterns", "Best Practices"]
    },
    {
      name: "API Reference",
      description: "Programmatic access to all features",
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      color: "#fca5a5",
      articles: ["Authentication", "Endpoints", "Webhooks", "SDKs"]
    },
    {
      name: "Integrations",
      description: "Connect with your existing tools",
      icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
      color: "#dc2626",
      articles: ["SIEM Integration", "SOAR Platforms", "Cloud Services", "Identity Providers"]
    },
    {
      name: "Security Guides",
      description: "Advanced security implementations",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "#b91c1c",
      articles: ["Threat Modeling", "Incident Response", "Compliance Mapping", "Hardening Guides"]
    },
    {
      name: "Support",
      description: "Troubleshooting and help",
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.879 16.121l-3.536-3.536M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "#7f1d1d",
      articles: ["Common Issues", "FAQ", "Contact Support", "Status Page"]
    }
  ];

  const popularGuides = [
    {
      title: "Zero Trust Network Access Implementation Guide",
      description: "Step-by-step guide to implementing ZTNA in your organization",
      level: "Advanced",
      time: "45 min read"
    },
    {
      title: "Cloud Security Posture Management Setup",
      description: "Configure CSPM for AWS, Azure, and GCP environments",
      level: "Intermediate",
      time: "30 min read"
    },
    {
      title: "SOC 2 Compliance Automation",
      description: "Automate evidence collection for SOC 2 Type II audits",
      level: "Intermediate",
      time: "25 min read"
    },
    {
      title: "Incident Response Playbook Builder",
      description: "Create automated response workflows for common threats",
      level: "Advanced",
      time: "40 min read"
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
              Developer Resources
            </span>
          </div>
          <h1 className="product-hero-title">CyberShield Documentation</h1>
          <p className="product-hero-subtitle">
            Comprehensive guides, API references, and tutorials to help you build secure applications 
            with enterprise-grade protection. From quick starts to advanced implementations.
          </p>
          <div className="search-box" style={{ maxWidth: "600px", margin: "2rem auto 0" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px" }}>
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search documentation..." />
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="product-section-container">
          <div className="section-intro" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Explore by Topic</span>
            <h2>Everything You Need to Secure Your Infrastructure</h2>
            <p style={{ maxWidth: "700px", margin: "0 auto", color: "#94a3b8" }}>
              From basic setup to advanced security implementations, find the resources you need 
              to maximize your security posture.
            </p>
          </div>
          
          <div className="docs-categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="docs-category-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="category-icon-wrapper" style={{ background: `${category.color}15` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={category.color} strokeWidth="2">
                    <path d={category.icon} />
                  </svg>
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <ul className="category-articles">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "14px", height: "14px", color: category.color }}>
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {article}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section" style={{ background: "var(--bg-secondary)" }}>
        <div className="product-section-container">
          <div className="section-intro" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Popular Guides</span>
            <h2>Start Building Secure Applications</h2>
          </div>
          
          <div className="popular-guides-grid">
            {popularGuides.map((guide, index) => (
              <div key={index} className="guide-card">
                <div className="guide-level" style={{ background: `${guide.level === "Advanced" ? "#ef4444" : "#f87171"}20`, color: guide.level === "Advanced" ? "#ef4444" : "#f87171" }}>
                  {guide.level}
                </div>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <div className="guide-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {guide.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="product-section-container">
          <div className="api-reference-card">
            <div className="api-info">
              <h2>REST API Reference</h2>
              <p>
                Complete reference documentation for the CyberShield API. 
                Manage users, configure policies, query threats, and automate responses 
                through our comprehensive REST API.
              </p>
              <div className="api-stats">
                <div className="api-stat">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">Endpoints</span>
                </div>
                <div className="api-stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">SDK Methods</span>
                </div>
                <div className="api-stat">
                  <span className="stat-number">99.99%</span>
                  <span className="stat-label">Uptime SLA</span>
                </div>
              </div>
              <div className="api-actions">
                <Link to="/register" className="btn btn-primary">Get API Key</Link>
                <button className="btn btn-outline">View API Docs</button>
              </div>
            </div>
            <div className="api-code-preview">
              <div className="code-header">
                <span className="code-lang">cURL</span>
              </div>
              <pre><code>{`curl -X GET "https://api.cybershield.io/v1/threats" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

{
  "results": [
    {
      "id": "thrt_abc123",
      "type": "malware",
      "severity": "critical",
      "source": "endpoint-01",
      "timestamp": "2026-03-02T10:30:00Z"
    }
  ],
  "total": 1247
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section" style={{ background: "var(--bg-secondary)" }}>
        <div className="product-section-container">
          <div className="support-grid">
            <div className="support-card">
              <div className="support-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Community Forum</h3>
              <p>Connect with other security professionals, share best practices, and get answers from the community.</p>
              <Link to="/register" className="support-link">Join Discussion →</Link>
            </div>
            <div className="support-card">
              <div className="support-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Video Tutorials</h3>
              <p>Watch step-by-step video guides covering installation, configuration, and advanced security topics.</p>
              <Link to="/webinars" className="support-link">Watch Now →</Link>
            </div>
            <div className="support-card">
              <div className="support-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Contact Support</h3>
              <p>Get help from our technical support team. Enterprise customers receive 24/7 priority support.</p>
              <Link to="/contact" className="support-link">Contact Us →</Link>
            </div>
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

export default DocumentationPage;
